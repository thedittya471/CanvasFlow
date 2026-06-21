import { db, eq, max } from "@repo/database"
import { formFieldsTable } from "@repo/database/models/form-field"
import {
    createFormFieldInput,
    type CreateFormFieldInputType,
    updateFormFieldInput,
    type UpdateFormFieldInputType,
    deleteFormFieldInput,
    type DeleteFormFieldInputType,
    getFormFieldInput,
    type GetFormFieldInputType,
    listFormFieldsInput,
    type ListFormFieldsInputType
} from "./model"

class FormFieldService {
    private async getNextIndex(formId: string): Promise<string> {
        const fields = await db
            .select({ maxIndex: max(formFieldsTable.index) })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))

        const current = fields[0]?.maxIndex
        const next = current ? parseFloat(current) + 1 : 1
        return next.toFixed(2)
    }

    public async createFormField(payload: CreateFormFieldInputType) {
        const { formId, label, placeholder, isRequired, type, options, description } = await createFormFieldInput.parseAsync(payload)

        const labelKey = label
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || "field"

        const index = await this.getNextIndex(formId)

        const insertResult = await db.insert(formFieldsTable).values({
            formId,
            label,
            labelKey,
            placeholder: placeholder || undefined,
            isRequired,
            index,
            type,
            options: options || undefined,
            description: description || undefined
        }).returning({
            id: formFieldsTable.id
        })

        if (!insertResult || insertResult.length === 0 || !insertResult[0]?.id) {
            throw new Error("Failed to create form field")
        }

        return {
            id: insertResult[0].id,
            labelKey,
            index
        }
    }

    public async updateFormField(payload: UpdateFormFieldInputType) {
        const { id, label, placeholder, isRequired, index, type, options, description } = await updateFormFieldInput.parseAsync(payload)

        const existingFieldResult = await db.select().from(formFieldsTable).where(eq(formFieldsTable.id, id))
        const existingField = existingFieldResult[0]
        if (!existingField) {
            throw new Error("Form field not found")
        }

        let newLabelKey: string | undefined = undefined
        const currentLabel = label !== undefined ? label : existingField.label
        const isCurrentlyUntitledKey = existingField.labelKey.startsWith("untitled") || existingField.labelKey === "field"
        const isNewCustomLabel = currentLabel !== "" && !currentLabel.toLowerCase().startsWith("untitled")

        if (isCurrentlyUntitledKey && isNewCustomLabel) {
            newLabelKey = currentLabel
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "") || "field"
        }

        const updateResult = await db.update(formFieldsTable)
            .set({
                ...(label !== undefined ? { label } : {}),
                ...(newLabelKey !== undefined ? { labelKey: newLabelKey } : {}),
                ...(placeholder !== undefined ? { placeholder } : {}),
                ...(isRequired !== undefined ? { isRequired } : {}),
                ...(index !== undefined ? { index } : {}),
                ...(type !== undefined ? { type } : {}),
                ...(options !== undefined ? { options } : {}),
                ...(description !== undefined ? { description } : {})
            })
            .where(eq(formFieldsTable.id, id))
            .returning({
                id: formFieldsTable.id
            })

        if (!updateResult || updateResult.length === 0 || !updateResult[0]?.id) {
            throw new Error("Failed to update form field or field not found")
        }

        return {
            id: updateResult[0].id
        }
    }

    public async deleteFormField(payload: DeleteFormFieldInputType) {
        const { id } = await deleteFormFieldInput.parseAsync(payload)

        const deleteResult = await db.delete(formFieldsTable)
            .where(eq(formFieldsTable.id, id))
            .returning({
                id: formFieldsTable.id
            })

        if (!deleteResult || deleteResult.length === 0 || !deleteResult[0]?.id) {
            throw new Error("Failed to delete form field or field not found")
        }

        return {
            success: true
        }
    }

    public async getFormField(payload: GetFormFieldInputType) {
        const { id } = await getFormFieldInput.parseAsync(payload)

        const result = await db.select().from(formFieldsTable).where(eq(formFieldsTable.id, id))
        const field = result[0]

        if (!field) {
            throw new Error("Form field not found")
        }

        return field
    }

    public async listFormFields(payload: ListFormFieldsInputType) {
        const { formId } = await listFormFieldsInput.parseAsync(payload)

        const result = await db.select()
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))
            .orderBy(formFieldsTable.index)

        return result
    }
}

export default FormFieldService
