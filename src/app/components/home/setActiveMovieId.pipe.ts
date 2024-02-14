import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'editOrTransformItem'
  })
  export class EditOrTransformItemPipe implements PipeTransform {
  
    transform(value: string, ...args: any[]): string {
      let result = "put here your transforamtion login"
      return result;
    }

}