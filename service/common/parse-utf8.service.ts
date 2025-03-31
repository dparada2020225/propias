import {Injectable} from '@angular/core';
import specialCharactersList from '../../../assets/data/parse-utf8.json'
import {CharacterMap} from "../../models/encryption-keys.interface";

@Injectable({
  providedIn: 'root'
})
export class ParseUtf8Service {
  specialCharactersList: CharacterMap = specialCharactersList;

  conversion(body: string, characterObj?: CharacterMap): string {
    try {
      const characterMap = characterObj ?? this.specialCharactersList;


      const characterKeyList = Object.keys(characterMap).map(this.escapeRegExp).join('|');

      const regexPattern = new RegExp(characterKeyList, 'g');

      return body.replace(regexPattern, (match: string) => {
        return characterMap[match];
      })
    } catch (e) {
      console.error(e);
      return body;
    }
  }

  private escapeRegExp(txt: string) {
    return txt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
