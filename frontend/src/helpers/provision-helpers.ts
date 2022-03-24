/**
 * This file contains all helper functions related to provision calculations
 */

/**
 * Returns the provision factor for a company depending on its total volume
 * @param {number} volume - total mortgage volume
 * @returns {number} - provision factor, between 0.6 and 0.76
 */
export function getProvisionFactor(volume: number){
  if(volume >= 18000000){
    return 0.75
  } else if(volume >= 12000000){
    return 0.7
  } else if(volume >= 6000000){
    return 0.65
  }
  return 0.6
}

/**
 * Calculates the total provision amount for a given dossier (which is later split between SOI and company)
 * @param {Record<string, unknown>} dossier - the dossier
 * @returns {number} - total provision amount
 */
export function getProvisionForDossier(dossier: Record<string, unknown>){
  let provision = 0

  const amounts = dossier.partition_amounts as number[]
  const dates = dossier.partition_dates as string[]
  const startDate = new Date(dossier.created_at as string)

  // Calculate provision for every partition
  for(let i = 0; i < amounts.length; i++){
    const amount = amounts[i]
    const endDate = new Date(dates[i])

    // Calculate partition's remaining runtime in years
    const durationInMs = endDate.getTime() - startDate.getTime()
    const durationInYears = durationInMs / (365 * 24 * 60 * 60 * 1000)

    // Formula: partition amount * duration in years / 1000
    // (1000 is an arbitrary factor determined by SOI)
    provision += amount * durationInYears / 1000
  }

  return Math.round(provision)
}

/**
 * Calculates the total provision for an employee
 * @param {Record<string, unknown>} employee - the employee, having 'dossiers'
 * @returns {number} - total provision amount
 */
export function getProvisionTotalForEmployee(employee: Record<string, unknown>){
  const dossiers = employee.dossiers as Record<string, unknown>[]
  let total = 0
  dossiers.forEach((dossier) => {
    total += getProvisionForDossier(dossier)
  })

  return Math.round(total)
}

/**
 * Filters a list of employees' dossiers by the given date(s)
 * @param {Record<string, unknown>[]} employees - list of employees that have dossiers
 * @param {Date} [fromDate] - from date filter
 * @param {Date} [toDate] - to date filter
 * @returns {Record<string, unknown>[]} - employees with filtered dossiers
 */
export function filterEmployeesDossiersByDates(employees: Record<string, unknown>[], fromDate?: Date, toDate?: Date){
  const correctedEmployees: Record<string, unknown>[] = []

  // For every employee, go through their dossiers
  employees.forEach((employee: Record<string, unknown>) => {
    const filteredDossiers = (employee.dossiers as Record<string, unknown>[]).filter((dossier: Record<string, unknown>) => {
      const validFrom = fromDate ? new Date(dossier.created_at as string).getTime() > fromDate.getTime() : true
      const validTo = toDate ? new Date(dossier.created_at as string).getTime() < toDate.getTime() : true
      return validFrom && validTo
    })

    // Add to employees array
    correctedEmployees.push({
      ...employee,
      dossiers: filteredDossiers
    })
  })

  return correctedEmployees
}
