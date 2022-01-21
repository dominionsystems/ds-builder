import { JsonParseMode, parseJson } from '@angular-devkit/core';
import {
  Tree,
  SchematicsException,
  SchematicContext,
  Rule,
  chain,
} from '@angular-devkit/schematics';
import { Workspace } from '../interfaces';

function getWorkspacae(host: Tree): { path: string; workspace: Workspace } {
  const possibleFiles = ['/angular.json', './angular.json'];
  const path = possibleFiles.find((path) => host.exists(path));
  const configBuffer = path ? host.read(path) : undefined;

  if (!path || !configBuffer) {
    throw new SchematicsException(`Could not find angular.json`);
  }

  const content = configBuffer.toString();
  let workspace: Workspace;

  try {
    workspace = parseJson(content, JsonParseMode.Loose) as {} as Workspace;
  } catch (e) {
    throw new SchematicsException(`Could not parse angular.json: ${e.message}`);
  }

  return { path, workspace };
}

interface NgAddOptions {
  project: string;
  source: string;
  destination: string;
}

export function dsBuilder(options: NgAddOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    // get workspace
    const { path: workspacePath, workspace } = getWorkspacae(tree);

    // getting project name
    if (!options.project) {
      throw new SchematicsException(`No Angular project selected`);
    }

    // check source path
    if (!options.source) {
      throw new SchematicsException(`Must provide a source path`);
    } else {
      const sourcePathExists = tree.exists(options.source);

      if (!sourcePathExists) {
        throw new SchematicsException(`No file at ${options.source} found`);
      }
    }

    // check destination path
    if (!options.destination) {
      throw new SchematicsException(`Must provide a destination path`);
    } else {
      const destPathExists = tree.exists(options.destination);

      if (!destPathExists) {
        throw new SchematicsException(
          `No file at ${options.destination} found`,
        );
      }
    }

    // validating project name
    const project = workspace.projects[options.project];
    if (!project || !project.architect) {
      throw new SchematicsException(
        'The specified Angular project is not defined in this workspace',
      );
    }

    // check for valid application
    if (project.projectType !== 'application') {
      throw new SchematicsException(
        `Deploy requires an Angular project type of "application" in angular.json`,
      );
    }

    project.architect['deploy'] = {
      builder: '@ds-builder/copy-file:copy',
      options: {
        source: options.source,
        destination: options.destination,
      },
    };

    tree.overwrite(workspacePath, JSON.stringify(workspace, null, 2));
    return tree;
  };
}

export default function (options: NgAddOptions): Rule {
  return chain([dsBuilder(options)]);
}
