import React from "react";
import PlanFormModal from "./PlanFormModal";

export default function EditPlanSection({ open = false, plan, onCancel, onSave }) {
    return <PlanFormModal open={open} mode="edit" plan={plan} onClose={onCancel} onSaved={onSave} />;
}