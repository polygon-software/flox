import {formatDate} from 'src/helpers/format-helpers';

/**
 * Preprocessor for search
 * @param {unknown} target - where to search
 * @param {string} term - what to search
 * @param {number} depthLimit - search limit
 * @returns {boolean} - found
 */
export function deepFilter(target:any, term:string, depthLimit=5):boolean{
  const cleanTerm = term.trim()
  return cleanTerm.split(' ').every((part)=>{
    console.log(part.toLowerCase())
    return recursiveFilter(target, part.toLowerCase(), depthLimit)
  })
}


/**
 * Recursive search
 * @param {unknown} target - where to search
 * @param {string} term - what to search
 * @param {number} depthLimit - search limit
 * @returns {boolean} - found
 */
function recursiveFilter(target:any, term:string, depthLimit=5):boolean{
  if(target === term){
    return true
  }

  if(target instanceof Date){
    return formatDate(target) === term
  }

  if(typeof target === 'boolean'){    //todo evt ja / nein
    return String(target) === term
  }

  if(typeof target === 'number'){
    return !isNaN(Number(term)) && Math.abs(Number(term) - (target )  ) < 0.1
  }

  if(typeof target === 'string'){
    return target.toLowerCase().includes(term )
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
