import React from "react";
import PlanFormModal from "./PlanFormModal";

export default function CreatePlanSection({ open = false, onCancel, onCreate }) {
    return <PlanFormModal open={open} mode="create" onClose={onCancel} onSaved={onCreate} />;
}