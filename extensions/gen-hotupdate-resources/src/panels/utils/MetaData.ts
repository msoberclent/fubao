
class UserData {
    isBundle: boolean
    constructor(isBundle : boolean) {
        this.isBundle = isBundle
    }
}

export class MetaData {
    ver: string
    bundleName: string
    userData: UserData
    constructor(ver? : string, isBundle? : boolean, bundleName? : string) {
        this.ver = ver || ""
        this.bundleName = bundleName || ""
        this.userData = new UserData(isBundle || false)
    }
}
