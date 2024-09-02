export class ValidateUtils {

  public static isChineseName(name: string) {
    name = name.replace(/·/g, '');
    let regName = /^[\u4e00-\u9fa5]{2,20}$/;
    return regName.test(name);
  }
}