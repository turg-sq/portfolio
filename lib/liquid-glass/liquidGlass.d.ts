export type LiquidGlassOptions={mode?:string;surface?:string;specular?:string;bezel?:number;thickness?:number;scale?:number;specularIntensity?:number;blur?:number;saturate?:number;dispersion?:number;lightAngle?:number;bend?:number;flip?:boolean}
export type LiquidGlassInstance={update:(patch:Partial<LiquidGlassOptions>)=>void;destroy:()=>void;refresh:()=>void;options:LiquidGlassOptions}
export declare function createLiquidGlass(host:HTMLElement,options?:LiquidGlassOptions):LiquidGlassInstance
