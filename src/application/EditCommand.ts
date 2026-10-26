import { Drawing } from "../domain/Drawing.js";
export abstract class EditCommand {
  abstract execute(drawing: Drawing): string;
}
