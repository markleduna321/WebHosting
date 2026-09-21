import React, { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import { Play, Loader2, Database, KeyRound, Eraser, Sprout } from "lucide-react";
import axios from "axios";

export default function CliSection({ website }) {
    const [output, setOutput] = useState("");
    const [customCommand, setCustomCommand] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const terminalRef = useRef(null);

    // Scroll to bottom when output changes
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [output]);

    const runCommand = async (command) => {
        if (!command.trim()) return;
        
        setIsRunning(true);
        setOutput((prev) => prev + `\n$ ${command}\n`);

        try {
            const response = await axios.post(`/api/websites/${website.uuid}/cli`, {
                command: command,
            });
            
            setOutput((prev) => prev + (response.data.output || "Command executed successfully with no output.\n"));
        } catch (error) {
            const errorMessage = error.response?.data?.output || error.response?.data?.message || error.message || "An unknown error occurred.";
            setOutput((prev) => prev + `[ERROR]: ${errorMessage}\n`);
        } finally {
            setIsRunning(false);
            setCustomCommand(""); // Clear input if it was a custom command
        }
    };

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        runCommand(customCommand);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Command Line Interface - {website.subdomain}</h3>
            
            <div className="mb-6">
                <p className="text-sm text-gray-500 mb-3">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={isRunning}
                        onClick={() => runCommand("php artisan migrate --force")}
                        className="flex items-center gap-2"
                    >
                        <Database size={14} />
                        Migrate
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={isRunning}
                        onClick={() => runCommand("php artisan key:generate --force")}
                        className="flex items-center gap-2"
                    >
                        <KeyRound size={14} />
                        Key Generate
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={isRunning}
                        onClick={() => runCommand("php artisan optimize:clear")}
                        className="flex items-center gap-2"
                    >
                        <Eraser size={14} />
                        Optimize Clear
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={isRunning}
                        onClick={() => runCommand("php artisan db:seed --force")}
                        className="flex items-center gap-2"
                    >
                        <Sprout size={14} />
                        Seed DB
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={isRunning}
                        onClick={() => runCommand("php artisan migrate:fresh --seed --force")}
                        className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                        <Database size={14} />
                        Migrate Fresh + Seed
                    </Button>
                </div>
            </div>

            <div className="mb-4">
                <div className="bg-gray-900 rounded-t-md border border-gray-800 p-2 flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-mono">Terminal (caleho)</span>
                    <button 
                        onClick={() => setOutput("")}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                        Clear
                    </button>
                </div>
                <div 
                    ref={terminalRef}
                    className="bg-[#1e1e1e] text-green-400 font-mono text-sm p-4 h-96 overflow-y-auto border-x border-b border-gray-800 rounded-b-md whitespace-pre-wrap break-words"
                >
                    {output || "Ready. Select a quick action or type a command below.\n"}
                    {isRunning && (
                        <div className="flex items-center gap-2 mt-2 text-gray-400">
                            <Loader2 size={14} className="animate-spin" />
                            <span>Executing...</span>
                        </div>
                    )}
                </div>
            </div>

            <form onSubmit={handleCustomSubmit} className="flex gap-2">
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-mono">$</span>
                    <input
                        type="text"
                        value={customCommand}
                        onChange={(e) => setCustomCommand(e.target.value)}
                        placeholder="php artisan list"
                        disabled={isRunning}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm disabled:bg-gray-100"
                    />
                </div>
                <Button 
                    type="submit" 
                    disabled={isRunning || !customCommand.trim()}
                    className="flex items-center gap-2"
                >
                    {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                    Run
                </Button>
            </form>
            <p className="mt-2 text-xs text-gray-500">
                Allowed commands start with: <code className="bg-gray-100 px-1 py-0.5 rounded">php artisan</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">composer</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">npm</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">npx</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">node</code>
            </p>
        </div>
    );
}
