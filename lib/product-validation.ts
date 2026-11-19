import { NextResponse } from 'next/server';

const editableFields = [
  'title',
  'description',
  'category',
  'country',
  'whatsapp',
  'email',
] as const;

type EditableField = (typeof editableFields)[number];
export type ProductInput = Partial<Record<EditableField, string>>;

type InputResult = { ok: true; value: ProductInput } | { ok: false; response: NextResponse };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const whatsappPattern = /^\+?[1-9]\d{6,14}$/;
const requiredFields: EditableField[] = ['title', 'description', 'category', 'country'];

export async function readProductInput(request: Request, partial: boolean): Promise<InputResult> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 }),
    };
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Request body must be a JSON object.' },
        { status: 400 }
      ),
    };
  }

  const record = body as Record<string, unknown>;
  const errors: Record<string, string> = {};
  const value: ProductInput = {};

  for (const key of Object.keys(record)) {
    if (!editableFields.includes(key as EditableField)) {
      errors[key] = 'This field cannot be provided.';
    }
  }

  if (partial && Object.keys(record).length === 0) {
    errors.body = 'Provide at least one field to update.';
  }

  for (const field of editableFields) {
    const provided = Object.hasOwn(record, field);

    if (!provided) {
      if (!partial && requiredFields.includes(field)) {
        errors[field] = 'This field is required.';
      }
      continue;
    }

    const raw = record[field];
    if (typeof raw !== 'string') {
      errors[field] = 'This field must be a string.';
      continue;
    }

    const normalized = raw.trim();
    if (field === 'email') {
      if (normalized && !emailPattern.test(normalized)) {
        errors.email = 'Enter a valid email address.';
      } else {
        value.email = normalized ? normalized.toLowerCase() : '';
      }
      continue;
    }

    if (field === 'whatsapp') {
      const phone = normalized.replace(/[\s()-]/g, '');
      if (phone && !whatsappPattern.test(phone)) {
        errors.whatsapp = 'Enter a valid WhatsApp number in international format.';
      } else {
        value.whatsapp = phone;
      }
      continue;
    }

    if (!normalized) {
      errors[field] = 'This field cannot be empty.';
      continue;
    }

    value[field] = normalized;
  }

  if (!partial && !value.email && !value.whatsapp) {
    errors.contact = 'Provide a valid WhatsApp number, email address, or both.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Product validation failed.', fields: errors },
        { status: 400 }
      ),
    };
  }

  return { ok: true, value };
}

export function hasContactMethod(email?: string, whatsapp?: string): boolean {
  return Boolean(email || whatsapp);
}
