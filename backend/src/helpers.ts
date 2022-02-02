import {ExecutionContext} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';
import * as crypto from 'crypto';
import {ROLE} from "./ENUM/ENUMS";

/**
 * Gets the request from context
 * @param {ExecutionContext} context - Execution Context
 * @returns {Request} - the request
 */
export function getRequest(context: ExecutionContext): any {
  const ctx = GqlExecutionContext.create(context);
  // If call is not from GraphQL, get req regularly
  if (!ctx.getContext()) {
    return context.switchToHttp().getRequest();
  }
  // Call is from GraphQL
  return ctx.getContext().req;
}

/**
 * Generates a short human-readable ID and for bank, company, and employee it adds a corresponding prefix
 * @param {ENUM} role - optional role of the object the ID will be created for
 * @param {number} [length] - length of the ID to generate
 * @returns {string} - an ID
 */
export function generateHumanReadableId(role = ROLE.NONE, length = 10): string {
  let result = '';

  // Exclude I and l to avoid confusion
  const alphabet = '0123456789';
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(crypto.randomInt(alphabet.length));
  }
  switch(role){
    case ROLE.BANK:
      result = `FI${result.substring(2)}`
      break
    case ROLE.COMPANY:
      result = `BR${result.substring(2)}`
      break
    case ROLE.EMPLOYEE:
      result = `MA${result.substring(2)}`
  }
  return result;
}
