type ProjectImageProps={src:string;alt:string;priority?:boolean;className?:string}

export default function ProjectImage({src,alt,priority=false,className}:ProjectImageProps){
  return <img className={className} src={src} alt={alt} loading={priority?'eager':'lazy'} decoding="async"/>
}
