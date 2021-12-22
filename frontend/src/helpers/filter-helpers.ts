import {formatDate} from 'src/helpers/format-helpers';

/**
 * Recursive search
 * @param {unknown|Date} target - where to search
 * @param {unknown} term - what to search
 * @param {number} depthLimit - search limit
 * @returns {boolean} - found
 */
export function recursiveFilter(target:any, term:unknown, depthLimit=5):boolean{
  if(target === term){
    return true
  }

  if(target instanceof Date){
    return formatDate(target) === term
  }

  if(typeof target === 'boolean'){
    return String(target) === term
  }

  if(typeof target === 'number'){
    return !isNaN(Number(term)) && Math.abs(Number(term) - (target )  ) < 0.1
  }

  if(target instanceof String){
    return target.includes(term as string)
  }
  // Cutoff
  if(depthLimit === 0){
    return false;
  }

  if(Array.isArray(target)){
    return target.some((item)=>{
      recursiveFilter(item, term,depthLimit-1)
    })
  }
  if(typeof target === 'object'){
    return Object.values(target as Record<string, unknown>).some((field)=>{
      if(field !== undefined && field !== null){
        return recursiveFilter(field, term, depthLimit - 1)
      }
      return false
    })
  }
  return false
}
