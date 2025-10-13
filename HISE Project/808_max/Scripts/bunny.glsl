// Variation of https://www.shadertoy.com/view/wtVyWK

uniform float amp;

vec3 erot(vec3 p, vec3 ax, float ro) {
    return mix(dot(p,ax)*ax,p,cos(ro))+sin(ro)*cross(ax,p);
}

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

float wobble(vec3 p, float scale)
{
    float x = (sin(scale*p.x)*sin(scale*p.y)*sin(scale*p.z));
    return -1.0 * x * x;
}

float scene(vec3 p) {
	
	float x = sin(4.0 * 2.0 * 3.14159 * fract(iTime));;
	
	p *= vec3(sin(3.14159 * fract(iTime)) * amp * 0.1 + 1.0);
	
	
	float d1 = sdSphere(p, 0.5);
	
	float gain = min(0.12, 0.12 * amp);
	
	
	
	p *= vec3(sin(5.0 *  3.14159 * fract(iTime)) * 0.1 + 1.0);
	
	float d2 = 1.5 * gain * wobble(p, 5.0);
	
	p *= vec3(sin(3.14159 * fract(iTime)) * 0.0 + 1.0);
	
	d2 += gain * .5 * wobble(p, amp);
	
	
	
	return d1 + d2;
}

vec3 norm(vec3 p) {
    mat3 k = mat3(p,p,p)-mat3(0.001);
    return normalize(scene(p) - vec3(scene(k[0]),scene(k[1]),scene(k[2])));
}

void main()
{
    vec2 uv = (fragCoord-0.5*iResolution.xy)/iResolution.y;
    vec2 mouse = (iMouse.xy-0.5*iResolution.xy)/iResolution.y;

    vec3 cam = normalize(vec3(1.5,uv));
    vec3 init = vec3(-3.,0,0);
    
    float yrot = 0.5;
    float zrot = iTime*.2;
    
    cam = erot(cam, vec3(0,1,0), yrot);
    init = erot(init, vec3(0,1,0), yrot);
    cam = erot(cam, vec3(0,0,1), zrot);
    init = erot(init, vec3(0,0,1), zrot);
    
    vec3 p = init;
    bool hit = false;
    for (int i = 0; i < 150 && !hit; i++) {
        float dist = scene(p);
        hit = dist*dist < 1e-6;
        p+=dist*cam;
        if (distance(p,init)>5.) break;
    }
    vec3 n = norm(p);
    vec3 r = reflect(cam,n);
    //don't ask how I stumbled on this texture
    vec3 nz = p - erot(p, vec3(1), 2.) + erot(p, vec3(1), 4.);
    float spec = length(sin(r*3.5+sin(nz*120.)*.15)*.4+.6)/sqrt(3.);
    spec *= smoothstep(-.3,.2,scene(p+r*.2));
    vec3 col = vec3(.1,.1,.12)*spec + pow(spec,8.);
    float bgdot = length(sin(cam*8.)*.4+.6)/2.;
    vec3 bg = vec3(.1,.1,.11);
    fragColor.xyz = hit ? col : bg;
    fragColor = smoothstep(-.02,1.05,sqrt(fragColor)) * (1.- dot(uv,uv)*.5);
}
