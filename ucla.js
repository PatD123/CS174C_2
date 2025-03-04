import {tiny, defs} from './examples/common.js';

// Pull these names into this module's scope for convenience:
const { vec3, vec4, color, Mat4, Shape, Material, Shader, Texture, Component } = tiny;

export class Curve_Shape extends Shape {
  // curve_function: (t) => vec3
  constructor(curve_function, sample_count, curve_color=color( 1, 0, 0, 1 )) {
    super("position", "normal");

    this.material = { shader: new defs.Phong_Shader(), ambient: 1.0, color: curve_color }
    this.sample_count = sample_count;
    this.curve_func = curve_function;

    if (curve_function && this.sample_count) {
      for (let i = 0; i < this.sample_count + 1; i++) {
        let t = i / this.sample_count;
        this.arrays.position.push(curve_function(t));
        this.arrays.normal.push(vec3(0, 0, 0)); // have to add normal to make Phong shader work.
      }
    }
  }

  draw(webgl_manager, uniforms) {
    // call super with "LINE_STRIP" mode
    super.draw(webgl_manager, uniforms, Mat4.identity(), this.material, "LINE_STRIP");
  }

  update(webgl_manager, uniforms, curve_function) {
    if (curve_function && this.sample_count) {
      for (let i = 0; i < this.sample_count + 1; i++) {
        let t = 1.0 * i / this.sample_count;
        this.arrays.position[i] = curve_function(t);
      }
    }
    // this.arrays.position.forEach((v, i) => v = curve_function(i / this.sample_count));
    this.copy_onto_graphics_card(webgl_manager.context);
    // Note: vertex count is not changed.
    // not tested if possible to change the vertex count.
  }

  get_arc_length() {
    let arc_length = 0;
    let lengths = [0];
    lengths.push(0);
    for(let i = 1; i<this.arrays.position.length; i++) {
      let p1 = this.arrays.position[i - 1];
      let p2 = this.arrays.position[i];
      let res = (p2.minus(p1)).norm();
      arc_length += res;

      lengths.push(arc_length);
    }

    console.log(lengths);

    for(let l of lengths) console.log(l / arc_length)

    return arc_length;
  }

  get_jobs() {
    let jobs = [];
    for(let i = 0; i<this.arrays.position.length; i++) {
      jobs.push(this.arrays.position[i]);
    }
    return jobs;
  }
};

export class Spline {
  constructor() {
    this.curves = [];
    this.points = [];
    this.tangents = [];
    this.size = 0;
  }

  h00(p, t) {
    return p.times(2*t*t*t - 3*t*t + 1);
  }

  h10(tan, t) {
    return tan.times(t*t*t-2*t*t+t);
  }

  h01(p, t) {
    return p.times(-2*t*t*t+3*t*t)
  }

  h11(tan, t) {
    return tan.times(t*t*t-t*t)
  }

  add_point(x, y, z, tx, ty, tz) {
    this.points.push(vec3(x, y, z));
    this.tangents.push(vec3(tx, ty, tz));
    this.size += 1;
  }

  add_curves(){
    if (this.size <= 1) return;
    
    this.curves = [];

    for(let i = 1; i < this.size; i++){
      let tan1 = this.tangents[i - 1].times(1.0 / (this.points.length - 1));
      let tan2 = this.tangents[i].times(1.0 / (this.points.length - 1));
      let curve_func = (t) => (
        this.h00(this.points[i - 1], t).plus(
          this.h10(tan1, t)
        ).plus(
          this.h01(this.points[i], t)
        ).plus(
          this.h11(tan2, t)
        )
      );
          
      let sample_cnt = 1000;
      this.curves.push(new Curve_Shape(curve_func, sample_cnt));
    }
  }

  at(t){
    let curve_idx = Math.floor(t) % this.curves.length;
    let curve_interpol_t = t % 1.0;

    let curr_p = this.curves[curve_idx].curve_func(curve_interpol_t);
    return curr_p;
  }

  get_jobs() {
    let jobs = [];
    for(let curve of this.curves) {
      jobs.push(curve.get_jobs());
    }
    console.log(jobs)
    return jobs.flat();
  }
}
