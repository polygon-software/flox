import { getConnection } from 'typeorm';
import { MR2000 } from '../types/MR2000';
import { MR3000 } from '../types/MR3000';
import { Project } from '../types/Project';

/**
 * This file contains all helper functions for fetching data from databases
 */

/**
 * Gets a prepared query runner for a given database
 * @param {string} database - database name (usually MR2000 or MR3000)
 * @returns {QueryRunner} - the query runner
 */
export async function getQueryRunner(database: string) {
  // Establish database connection
  const conn = getConnection(database);
  const queryRunner = conn.createQueryRunner();
  await queryRunner.connect();

  return queryRunner;
}

/**
 * Gets an array of the objects within a given database table
 * @param {string} database - database name
 * @param {string} table - table name
 * @param {string} [filterQuery] - optional SQL filtering query
 * @returns {Record<string, unknown>[]} - database table contents
 */
export async function fetchFromTable(
  database: string,
  table: string,
  filterQuery?: string,
) {
  // Get query runner
  const queryRunner = await getQueryRunner(database);

  return queryRunner.manager.query(
    `
      SELECT * FROM ${table}
      ${filterQuery ?? ''}
      `,
  );
}

/**
 * Builds an array of project from a list of each MR2000 and MR3000 instances
 * @param {Record<string, unknown>[]} mr2000instances - list of MR2000 instances (as RowDataPacket[])
 * @param {Record<string, unknown>[]} mr3000instances - list of MR3000 instances (as RowDataPacket[])
 * @returns {Project[]} - list of the corresponding projects
 */
export function getProjectsForInstances(
  mr2000instances: Record<string, string>[],
  mr3000instances: Record<string, string>[],
) {
  const projects = [];

  const allInstances = [
    {
      instances: mr2000instances,
      isMR2000: true,
    },
    {
      instances: mr3000instances,
      isMR2000: false,
    },
  ];

  // Find & create projects for MR2000 instances
  allInstances.forEach((instanceType) => {
    instanceType.instances.forEach((instance) => {
      const convertedInstance = instanceType.isMR2000
        ? new MR2000(instance.cli)
        : new MR3000(instance.cli);
      // If instance belongs to a project
      if (instance.comment) {
        const existingProject = projects.find(
          (project) => project.name === instance.comment.trim(),
        );
        // If no project in array yet
        if (!existingProject) {
          projects.push(
            new Project(
              instance.comment.trim(),
              instanceType.isMR2000 ? [convertedInstance] : [],
              instanceType.isMR2000 ? [] : [convertedInstance],
            ),
          );
        } else {
          // If project exists, add to its instances
          existingProject[
            instanceType.isMR2000 ? 'mr2000instances' : 'mr3000instances'
          ].push(convertedInstance);
        }
      }
    });
  });

  return projects;
}
