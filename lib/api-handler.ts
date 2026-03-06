import { NextRequest, NextResponse } from 'next/server'
import { ZodType, ZodTypeDef } from 'zod'

type ParseSuccess<T> = { success: true; data: T }
type ParseFailure = { success: false; response: NextResponse }

type RouteHandler = (req: NextRequest, context?: any) => Promise<NextResponse>

export function withErrorHandling(handler: RouteHandler): RouteHandler {
  return async (req, context) => {
    try {
      return await handler(req, context)
    } catch (error) {
      console.error(`[API Error] ${req.method} ${req.url}:`, error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

export async function parseBody<Output, Def extends ZodTypeDef = ZodTypeDef, Input = Output>(
  req: NextRequest,
  schema: ZodType<Output, Def, Input>
): Promise<ParseSuccess<Output> | ParseFailure> {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return {
      success: false,
      response: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }),
    }
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      ),
    }
  }

  return { success: true, data: parsed.data }
}
