export namespace PiterDirector {

    /**
     * 自动绑定
     * AT_ 可以不传入 nodeName
     * @param TYPE 
     * @param nodeName 
     * @returns 
     */
    export const AUTO_BIND = (TYPE: any, nodeName?: string) => {
        return (target: any, name: string) => {
            target.__autobind__ = target.__autobind__ || {}
            target.__autobind__[name] = TYPE;
            if (nodeName) {
                target.__bindname__ = target.__bindname__ || {};
                target.__bindname__[name] = nodeName;
            }
        }
    }
}