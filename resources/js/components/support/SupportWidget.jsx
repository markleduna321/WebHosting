import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    CheckCircle2,
    LifeBuoy,
    Loader2,
    Mail,
    MessageCircle,
    Send,
    ShieldAlert,
    X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
    useCreateSupportConversationMutation,
    useLazyGetSupportConversationQuery,
    useRequestSupportHandoffMutation,
    useSendSupportMessageMutation,
} from "@/features/support/supportApi";

const STORAGE_KEY = "caleho_support_conversation";
const QUICK_PROMPTS = ["Plans and pricing", "Payment and invoices", "My deployment"];
const TOPIC_NOTICE =
    "AI-assisted Caleho support. Chats are saved; a handoff shares the transcript with support. No code help. Never share passwords, one-time codes, or payment details.";

function readStoredConversation() {
    try {
        return window.sessionStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

function writeStoredConversation(id) {
    try {
        if (id) window.sessionStorage.setItem(STORAGE_KEY, id);
        else window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        // The current chat remains usable if browser storage is unavailable.
    }
}

function friendlyError(error) {
    if (error?.status === 429) return "You've sent several messages. Please wait a moment and try again.";
    if (error?.status === 503) return error?.data?.message ?? "Support is temporarily unavailable. Please try again or contact support.";
    if (error?.status === 404) return "This conversation is no longer available. Start a new one.";
    return error?.data?.message ?? "We couldn't send that message. Please try again.";
}

export default function SupportWidget() {
    const [open, setOpen] = useState(false);
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [handoffOpen, setHandoffOpen] = useState(false);
    const [handoffEmail, setHandoffEmail] = useState("");
    const [handoffReference, setHandoffReference] = useState("");
    const [sending, setSending] = useState(false);
    const [creating, setCreating] = useState(false);
    const inputRef = useRef(null);
    const endRef = useRef(null);
    const reduceMotion = useReducedMotion();

    const [createConversation] = useCreateSupportConversationMutation();
    const [loadConversation] = useLazyGetSupportConversationQuery();
    const [sendMessage, { isLoading: isSending }] = useSendSupportMessageMutation();
    const [requestHandoff, { isLoading: isHandingOff }] = useRequestSupportHandoffMutation();

    useEffect(() => {
        const storedId = readStoredConversation();
        if (!storedId) return;

        let active = true;
        loadConversation(storedId).unwrap().then((loaded) => {
            if (!active) return;
            setConversation(loaded);
            setMessages(loaded?.messages ?? []);
            if (loaded?.status === "handoff_requested") {
                setHandoffReference(storedId.replaceAll("-", "").slice(0, 10).toUpperCase());
            }
        }).catch(() => {
            if (!active) return;
            writeStoredConversation(null);
        });

        return () => {
            active = false;
        };
    }, [loadConversation]);

    useEffect(() => {
        const openWidget = () => setOpen(true);
        window.addEventListener("caleho:support:open", openWidget);
        return () => window.removeEventListener("caleho:support:open", openWidget);
    }, []);

    useEffect(() => {
        if (!open) return undefined;
        inputRef.current?.focus();
        const onKeyDown = (event) => {
            if (event.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }, [messages, error, open, reduceMotion]);

    const ensureConversation = async () => {
        if (conversation?.id) return conversation;

        setCreating(true);
        try {
            const created = await createConversation().unwrap();
            setConversation(created);
            writeStoredConversation(created.id);
            return created;
        } finally {
            setCreating(false);
        }
    };

    const sendText = async (rawText) => {
        const content = rawText.trim();
        if (!content || sending || isSending || creating || conversation?.status === "handoff_requested") return;

        setError("");
        setInput("");
        setSending(true);
        const localMessage = { id: `local-${Date.now()}`, role: "user", content };
        setMessages((current) => [...current, localMessage]);

        try {
            const activeConversation = await ensureConversation();
            const result = await sendMessage({ id: activeConversation.id, content }).unwrap();
            setMessages((current) => [
                ...current,
                { id: `reply-${Date.now()}`, role: "assistant", content: result.content },
            ]);
        } catch (requestError) {
            if (requestError?.status === 404) {
                setConversation(null);
                setMessages([]);
                writeStoredConversation(null);
            }
            setError(friendlyError(requestError));
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        sendText(input);
    };

    const startHandoff = async () => {
        setError("");
        setHandoffReference("");

        try {
            const activeConversation = await ensureConversation();
            setHandoffOpen(true);
            if (!activeConversation.requires_email_for_handoff) {
                await submitHandoff(activeConversation.id, "");
            }
        } catch (requestError) {
            setError(friendlyError(requestError));
        }
    };

    const submitHandoff = async (id = conversation?.id, email = handoffEmail) => {
        if (!id) return;
        setError("");
        try {
            const result = await requestHandoff({ id, email }).unwrap();
            setHandoffReference(result.reference);
            setConversation((current) => current ? { ...current, status: result.status } : current);
            setHandoffOpen(false);
        } catch (requestError) {
            setError(friendlyError(requestError));
        }
    };

    const startNewConversation = () => {
        setConversation(null);
        setMessages([]);
        setInput("");
        setError("");
        setHandoffOpen(false);
        setHandoffReference("");
        writeStoredConversation(null);
    };

    return (
        <>
            <AnimatePresence>
                {open && (
                    <motion.section
                        initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 340, damping: 28 }}
                        role="dialog"
                        aria-label="Caleho Host support chat"
                        aria-modal="false"
                        className="fixed bottom-20 right-4 z-[70] flex h-[min(80vh,42rem)] w-[min(calc(100vw-2rem),26rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#080C14]/95 text-slate-100 shadow-[0_20px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:right-6"
                    >
                        <header className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                                <LifeBuoy className="h-5 w-5" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-sm font-semibold text-white">Caleho Support</h2>
                                <p className="text-xs text-slate-400">Product help and human handoff</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close support chat"
                                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </header>

                        <div className="border-b border-amber-400/15 bg-amber-400/[0.06] px-4 py-2.5">
                            <p className="flex gap-2 text-[11px] leading-4 text-amber-100/80">
                                <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
                                {TOPIC_NOTICE}
                            </p>
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite" aria-relevant="additions text">
                            {messages.length === 0 && !handoffReference && (
                                <div className="space-y-4">
                                    <div className="rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.05] p-3.5 text-sm leading-5 text-slate-200">
                                        Hi. Ask about your Caleho account, plans, payments, deployments, or hosting tools.
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {QUICK_PROMPTS.map((prompt) => (
                                            <button
                                                key={prompt}
                                                type="button"
                                                onClick={() => sendText(prompt)}
                                                disabled={sending || creating}
                                                className="min-h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs text-slate-300 transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-50"
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <p className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-5 ${message.role === "user" ? "rounded-br-sm bg-cyan-500/20 text-cyan-50" : "rounded-bl-sm border border-white/10 bg-white/[0.05] text-slate-200"}`}>
                                        {message.content}
                                    </p>
                                </div>
                            ))}

                            {(sending || creating || isSending) && (
                                <div className="flex items-center gap-2 text-xs text-slate-400" role="status">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-300" />
                                    Checking support information…
                                </div>
                            )}

                            {error && (
                                <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.08] p-3 text-xs leading-5 text-rose-100" role="alert">
                                    {error}
                                </div>
                            )}

                            {handoffReference && (
                                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] p-3.5" role="status">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-100">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Request sent
                                    </div>
                                    <p className="mt-1.5 text-xs leading-5 text-slate-300">
                                        Support reference <span className="font-mono text-emerald-100">{handoffReference}</span>. We’ll reply by email.
                                    </p>
                                    <button type="button" onClick={startNewConversation} className="mt-3 min-h-10 text-xs font-medium text-cyan-200 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
                                        Start a new conversation
                                    </button>
                                </div>
                            )}
                            <div ref={endRef} />
                        </div>

                        {handoffOpen && !handoffReference && (
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    submitHandoff();
                                }}
                                className="border-t border-white/10 bg-white/[0.03] p-3.5"
                            >
                                {conversation?.requires_email_for_handoff && (
                                    <label className="mb-2 block text-xs text-slate-300" htmlFor="support-handoff-email">
                                        Where should support reply?
                                    </label>
                                )}
                                {conversation?.requires_email_for_handoff && (
                                    <input
                                        id="support-handoff-email"
                                        type="email"
                                        required
                                        maxLength={255}
                                        autoComplete="email"
                                        value={handoffEmail}
                                        onChange={(event) => setHandoffEmail(event.target.value)}
                                        placeholder="you@example.com"
                                        className="mb-3 min-h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                                    />
                                )}
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setHandoffOpen(false)} className="min-h-11 flex-1 rounded-xl border border-white/10 text-xs text-slate-300 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
                                        Keep chatting
                                    </button>
                                    <button type="submit" disabled={isHandingOff} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-3 text-xs font-semibold text-slate-950 transition-colors hover:bg-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:opacity-50">
                                        {isHandingOff ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                                        Send to support
                                    </button>
                                </div>
                            </form>
                        )}

                        {!handoffOpen && !handoffReference && (
                            <>
                                {conversation && conversation.status === "open" && (
                                    <div className="border-t border-white/10 px-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={startHandoff}
                                            disabled={sending || creating || isSending}
                                            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs text-slate-400 transition-colors hover:text-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-40"
                                        >
                                            <Mail className="h-3.5 w-3.5" />
                                            Contact a person
                                        </button>
                                    </div>
                                )}
                                <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-white/10 bg-black/10 p-3">
                                    <textarea
                                        ref={inputRef}
                                        value={input}
                                        onChange={(event) => setInput(event.target.value.slice(0, 1000))}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter" && !event.shiftKey) {
                                                event.preventDefault();
                                                handleSubmit(event);
                                            }
                                        }}
                                        rows={1}
                                        maxLength={1000}
                                        placeholder="Ask about Caleho Host…"
                                        aria-label="Message Caleho support"
                                        disabled={sending || creating || isSending || conversation?.status === "handoff_requested"}
                                        className="max-h-24 min-h-11 flex-1 resize-y rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || sending || creating || isSending || conversation?.status === "handoff_requested"}
                                        aria-label="Send message"
                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 transition-colors hover:bg-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        {sending || isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.section>
                )}
            </AnimatePresence>

            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                aria-label={open ? "Close Caleho support" : "Open Caleho support"}
                aria-expanded={open}
                className="fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200/20 bg-[#111827] text-cyan-200 shadow-[0_0_32px_rgba(6,182,212,0.25)] transition-colors hover:bg-[#1a2236] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
                {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
                {!open && <span className="sr-only">Support chat available</span>}
            </button>
        </>
    );
}
