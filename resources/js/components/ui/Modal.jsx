import React from "react";
import { Modal as AntModal } from "antd";
import { X } from "lucide-react";

export default function Modal({
    open,
    onCancel,
    title,
    subtitle,
    children,
    footer = null,
    width = 720,
    className = "",
    bodyClassName = "",
    centered = true,
    style,
}) {
    return (
        <AntModal
            open={open}
            onCancel={onCancel}
            centered={centered}
            width={width}
            style={{ top: 20, ...style }}
            footer={footer}
            closeIcon={<X className="h-4 w-4 text-slate-400" />}
            title={
                title ? (
                    <div className="pr-8">
                        <div className="text-lg font-semibold text-slate-900">{title}</div>
                        {subtitle && <div className="text-sm text-slate-500">{subtitle}</div>}
                    </div>
                ) : null
            }
            styles={{
                body: {
                    paddingTop: 16,
                    paddingBottom: 16,
                },
                footer: footer
                    ? {
                        borderTop: "1px solid #e2e8f0",
                        marginTop: 0,
                        paddingTop: 12,
                    }
                    : undefined,
            }}
            className={className}
        >
            <div className={bodyClassName}>{children}</div>
        </AntModal>
    );
}