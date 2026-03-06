import type { ComparativeMatrix, ArticuladoLine } from '@/types/procurement'

export interface SupplierTotal {
  total: number
  coverage: number
  lines: string[]
}

/**
 * Calculate totals and coverage for each supplier across all articulado lines.
 */
export function calculateSupplierTotals(
  suppliers: string[],
  articuladoLines: ArticuladoLine[],
  comparativeMatrix: ComparativeMatrix
): { [supplier: string]: SupplierTotal } {
  const totals: { [supplier: string]: SupplierTotal } = {}

  suppliers.forEach((supplier) => {
    let total = 0
    let coverage = 0
    const lines: string[] = []

    articuladoLines.forEach((line) => {
      const supplierData = comparativeMatrix[line.id]?.[supplier]
      if (supplierData?.available && supplierData.price) {
        total += supplierData.price * line.plannedQuantity
        coverage++
        lines.push(line.id)
      }
    })

    totals[supplier] = {
      total,
      coverage: articuladoLines.length > 0 ? (coverage / articuladoLines.length) * 100 : 0,
      lines,
    }
  })

  return totals
}

/**
 * Calculate the total value of the currently selected scenario.
 */
export function calculateScenarioTotal(
  articuladoLines: ArticuladoLine[],
  selectedScenario: { [lineId: string]: string },
  comparativeMatrix: ComparativeMatrix
): number {
  let total = 0
  articuladoLines.forEach((line) => {
    const selectedSupplier = selectedScenario[line.id]
    if (selectedSupplier) {
      const supplierData = comparativeMatrix[line.id]?.[selectedSupplier]
      if (supplierData?.available && supplierData.price) {
        total += supplierData.price * line.plannedQuantity
      }
    }
  })
  return total
}

/**
 * Find the best price and supplier for a given articulado line.
 */
export function getBestPrice(
  lineId: string,
  suppliers: string[],
  comparativeMatrix: ComparativeMatrix
): { price: number | null; supplier: string } {
  let bestPrice = Number.POSITIVE_INFINITY
  let bestSupplier = ''

  suppliers.forEach((supplier) => {
    const supplierData = comparativeMatrix[lineId]?.[supplier]
    if (supplierData?.available && supplierData.price && supplierData.price < bestPrice) {
      bestPrice = supplierData.price
      bestSupplier = supplier
    }
  })

  return { price: bestPrice === Number.POSITIVE_INFINITY ? null : bestPrice, supplier: bestSupplier }
}

/**
 * Check if all lines have a supplier selected (valid for award creation).
 */
export function isValidForAward(
  articuladoLines: ArticuladoLine[],
  selectedScenario: { [lineId: string]: string }
): boolean {
  return articuladoLines.every((line) => selectedScenario[line.id])
}
