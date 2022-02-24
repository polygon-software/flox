import { MR2000 } from '../types/MR2000';
import { MR3000 } from '../types/MR3000';
import { Project } from '../types/Project';
import {
  mr2000fromDatabaseEntry,
  mr3000fromDatabaseEntry,
} from './device-helpers';

/**
 * This file contains all project-related helper functions
 */

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
        ? mr2000fromDatabaseEntry(instance)
        : mr3000fromDatabaseEntry(instance);
      // If instance belongs to a project
      if (instance.comment) {
        const existingProject = projects.find(
          (project) => project.name === instance.comment.trim(),
        );
        // If no project in array yet
        if (!existingProject) {
          projects.push(
            createProjectForInstance(
              instance.comment.trim(),
              convertedInstance,
              instanceType.isMR2000,
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

/**
 * Creates a project, given an initial instance and its type
 * @param {string} name - project name
 * @param {MR2000|MR3000} instance - the initial instance
 * @param {boolean} isMR2000 - whether it's an MR2000 instance
 * @returns {Project} - the new Project
 */
function createProjectForInstance(
  name: string,
  instance: MR2000 | MR3000,
  isMR2000: boolean,
) {
  return new Project(
    name,
    isMR2000 ? ([instance] as MR2000[]) : [],
    isMR2000 ? [] : ([instance] as MR3000[]),
  );
}
