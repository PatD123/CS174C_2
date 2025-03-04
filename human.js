import {tiny, defs} from './examples/common.js';

// Pull these names into this module's scope for convenience:
const { vec3, vec4, color, Mat4, Shape, Material, Shader, Texture, Component } = tiny;

const shapes = {
    'sphere': new defs.Subdivision_Sphere( 5 ),
};

export
const Articulated_Human = 
class Articulated_Human {
    constructor() {
        const sphere_shape = shapes.sphere;

        // torso node
        const torso_transform = Mat4.scale(1, 2.5, 0.5);
        this.torso_node = new Node("torso", sphere_shape, torso_transform);
        // root->torso
        const root_location = Mat4.translation(1.9, 4.5, 2.5);
        this.root = new Arc("root", null, this.torso_node, root_location);

        // head node
        let head_transform = Mat4.scale(.6, .6, .6);
        head_transform.pre_multiply(Mat4.translation(0, .6, 0));
        this.head_node = new Node("head", sphere_shape, head_transform);
        // torso->neck->head
        const neck_location = Mat4.translation(0, 2.5, 0);
        this.neck = new Arc("neck", this.torso_node, this.head_node, neck_location);
        this.torso_node.children_arcs.push(this.neck);

        // LEG 1 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        let lu_leg_transform = Mat4.scale(.2, 1.2, .2);
        lu_leg_transform.pre_multiply(Mat4.translation(0.3, -5.35, 0));
        this.lu_leg_node = new Node("lu_arm", sphere_shape, lu_leg_transform);
        // torso->r_shoulder->lu_arm
        const l_pelvis_location = Mat4.translation(-0.6, 2, 0);
        this.l_pelvis = new Arc("r_shoulder", this.torso_node, this.lu_leg_node, l_pelvis_location);
        this.torso_node.children_arcs.push(this.l_pelvis)
        this.l_pelvis.set_dof(true, true, true);

        // LEG 2 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        let ru_leg_transform = Mat4.scale(.2, 1.2, .2);
        ru_leg_transform.pre_multiply(Mat4.translation(1., -5.35, 0));
        this.ru_leg_node = new Node("lu_arm", sphere_shape, ru_leg_transform);
        // torso->r_shoulder->lu_arm
        const r_pelvis_location = Mat4.translation(-0.6, 2, 0);
        this.r_pelvis = new Arc("r_shoulder", this.torso_node, this.ru_leg_node, r_pelvis_location);
        this.torso_node.children_arcs.push(this.r_pelvis)
        this.r_pelvis.set_dof(true, true, true);

        // LEFT ARM ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

        let lu_arm_transform = Mat4.scale(1.2, .2, .2);
        lu_arm_transform.pre_multiply(Mat4.translation(-1.2, 0, 0));
        this.lu_arm_node = new Node("lu_arm", sphere_shape, lu_arm_transform);
        // torso->r_shoulder->lu_arm
        const l_shoulder_location = Mat4.translation(-0.6, 2, 0);
        this.l_shoulder = new Arc("r_shoulder", this.torso_node, this.lu_arm_node, l_shoulder_location);
        this.torso_node.children_arcs.push(this.l_shoulder)
        this.l_shoulder.set_dof(true, true, true);

        // left lower arm node
        let ll_arm_transform = Mat4.scale(1, .2, .2);
        ll_arm_transform.pre_multiply(Mat4.translation(-1, 0, 0));
        this.ll_arm_node = new Node("rl_arm", sphere_shape, ll_arm_transform);
        // lu_arm->l_elbow->ll_arm
        const l_elbow_location = Mat4.translation(-2.4, 0, 0);
        this.l_elbow = new Arc("r_elbow", this.lu_arm_node, this.ll_arm_node, l_elbow_location);
        this.lu_arm_node.children_arcs.push(this.l_elbow)
        this.l_elbow.set_dof(true, true, false);

        // left hand node
        let l_hand_transform = Mat4.scale(.4, .3, .2);
        l_hand_transform.pre_multiply(Mat4.translation(-0.4, 0, 0));
        this.l_hand_node = new Node("r_hand", sphere_shape, l_hand_transform);
        // rl_arm->r_wrist->r_hand
        const l_wrist_location = Mat4.translation(-2, 0, 0);
        this.l_wrist = new Arc("r_wrist", this.ll_arm_node, this.l_hand_node, l_wrist_location);
        this.ll_arm_node.children_arcs.push(this.l_wrist);
        this.l_wrist.set_dof(true, false, true);

        // RIGHT ARM ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // right upper arm node
        let ru_arm_transform = Mat4.scale(1.2, .2, .2);
        ru_arm_transform.pre_multiply(Mat4.translation(1.2, 0, 0));
        this.ru_arm_node = new Node("ru_arm", sphere_shape, ru_arm_transform);
        // torso->r_shoulder->ru_arm
        const r_shoulder_location = Mat4.translation(0.6, 2, 0);
        this.r_shoulder = new Arc("r_shoulder", this.torso_node, this.ru_arm_node, r_shoulder_location);
        this.torso_node.children_arcs.push(this.r_shoulder)
        this.r_shoulder.set_dof(true, true, true);

        // right lower arm node
        let rl_arm_transform = Mat4.scale(1, .2, .2);
        rl_arm_transform.pre_multiply(Mat4.translation(1, 0, 0));
        this.rl_arm_node = new Node("rl_arm", sphere_shape, rl_arm_transform);
        // ru_arm->r_elbow->rl_arm
        const r_elbow_location = Mat4.translation(2.4, 0, 0);
        this.r_elbow = new Arc("r_elbow", this.ru_arm_node, this.rl_arm_node, r_elbow_location);
        this.ru_arm_node.children_arcs.push(this.r_elbow)
        this.r_elbow.set_dof(true, true, false);

        // right hand node
        let r_hand_transform = Mat4.scale(.4, .3, .2);
        r_hand_transform.pre_multiply(Mat4.translation(0.4, 0, 0));
        this.r_hand_node = new Node("r_hand", sphere_shape, r_hand_transform);
        // rl_arm->r_wrist->r_hand
        const r_wrist_location = Mat4.translation(2, 0, 0);
        this.r_wrist = new Arc("r_wrist", this.rl_arm_node, this.r_hand_node, r_wrist_location);
        this.rl_arm_node.children_arcs.push(this.r_wrist);
        this.r_wrist.set_dof(true, false, true);

        // add the only end-effector
        const r_hand_end_local_pos = vec4(0.8, 0, 0, 1);
        this.end_effector = new End_Effector("right_hand", this.r_wrist, r_hand_end_local_pos);
        this.r_wrist.end_effector = this.end_effector;

        // here I only use 7 dof
        this.dof = 7;
        this.Jacobian = null;
        this.theta = [0, 0, 0, 0, 0, 0, 0];
        this.apply_theta();
        this.get_end_effector_position();
        console.log("INITIAL GLOBAL POSITION: ", this.end_effector.global_position)
    }

    update_delta_theta(delta_theta) {
        this.theta = this.theta.map((val, i) => val + delta_theta[i]);
    }

    // mapping from global theta to each joint theta
    apply_theta() {
        // TODO: Implement your theta mapping here
        // Once you get the answer, update the thetas.
        this.r_shoulder.update_articulation(this.theta.slice(0, 3));
        this.r_elbow.update_articulation(this.theta.slice(3, 5));
        this.r_wrist.update_articulation(this.theta.slice(5, 7));
    }

    calculate_Jacobian() {
        let J = new Array(3);
        for (let i = 0; i < 3; i++) {
            J[i] = new Array(this.dof);
        }
        
        // TODO: Implement your Jacobian here
        let e = 0.000001;
        for(let i = 0; i<3; i++) {
            for(let j = 0; j < 7; j++) {

                // console.log("OLD: ", this.end_effector.global_position)

                this.theta[j] += e;
                this.apply_theta();
                let forward = this.get_end_effector_position();

                this.theta[j] -= 2 * e;
                this.apply_theta();
                let backward = this.get_end_effector_position();


                J[i][j] = (forward[i] - backward[i]) / (2 * e);

                // console.log("NEW: ", new_position_i)

                this.theta[j] += e;
                this.apply_theta();
                this.get_end_effector_position();
            }
        }

        // console.log("END OF JAC: ", this.end_effector.global_position)

        return J; // 3x7 in my case.
    }

    calculate_delta_theta(J, dx) {
        let lambda = 0.000001;
        let JT = math.transpose(J);
        let JJT = math.multiply(J, JT);
        JJT = math.add(lambda, JJT)
        const inverse = math.inv(JJT);
        let pseudoinverse = math.multiply(JT, inverse);
        return math.multiply(pseudoinverse, [dx[0], dx[1], dx[2]])
    }

    get_end_effector_position() {
        // in this example, we only have one end effector.
        this.matrix_stack = [];
        this._rec_update(this.root, Mat4.identity());
        const v = this.end_effector.global_position; // vec4
        return vec3(v[0], v[1], v[2]);
    }

    _rec_update(arc, matrix) {
        if (arc !== null) {
            const L = arc.location_matrix;
            const A = arc.articulation_matrix;
            matrix.post_multiply(L.times(A));
            this.matrix_stack.push(matrix.copy());

            const node = arc.child_node;
            const T = node.transform_matrix;
            matrix.post_multiply(T);

            // Updating global position of the end effector.
            // We're assuming the hand length is 1.
            let hand_l = 1;
            this.end_effector.global_position = matrix.times(vec4(hand_l, 0, 0, 1))

            matrix = this.matrix_stack.pop();
            for (const next_arc of node.children_arcs) {
                this.matrix_stack.push(matrix.copy());
                this._rec_update(next_arc, matrix);
                matrix = this.matrix_stack.pop();
            }
        }
    }

    draw(webgl_manager, uniforms, material) {
        this.matrix_stack = [];
        this._rec_draw(this.root, Mat4.identity(), webgl_manager, uniforms, material);
    }

    _rec_draw(arc, matrix, webgl_manager, uniforms, material) {
        if (arc !== null) {
            const L = arc.location_matrix;
            const A = arc.articulation_matrix;
            matrix.post_multiply(L.times(A));
            this.matrix_stack.push(matrix.copy());

            const node = arc.child_node;
            const T = node.transform_matrix;
            matrix.post_multiply(T);
            node.shape.draw(webgl_manager, uniforms, matrix, material);

            matrix = this.matrix_stack.pop();
            for (const next_arc of node.children_arcs) {
                this.matrix_stack.push(matrix.copy());
                this._rec_draw(next_arc, matrix, webgl_manager, uniforms, material);
                matrix = this.matrix_stack.pop();
            }
        }
    }

    debug(arc=null, id=null) {

        // this.theta = this.theta.map(x => x + 0.01);
        // this.apply_theta();
        const J = this.calculate_Jacobian();
        let dx = [[0], [-0.02], [0]];
        if (id === 2)
            dx = [[-0.02], [0], [0]];
        const dtheta = this.calculate_delta_theta(J, dx);

        // const direction = new Array(this.dof);
        // let norm = 0;
        // for (let i = 0; i < direction.length; i++) {
        //     direction[i] = dtheta[i][0];
        //     norm += direction[i] ** 2.0;
        // }
        // norm = norm ** 0.5;
        // console.log(direction);
        // console.log(norm);
        // this.theta = this.theta.map((v, i) => v + 0.01 * (direction[i] / norm));
        this.theta = this.theta.map((v, i) => v + dtheta[i][0]);
        this.apply_theta();

        // if (arc === null)
        //     arc = this.root;
        //
        // if (arc !== this.root) {
        //     arc.articulation_matrix = arc.articulation_matrix.times(Mat4.rotation(0.02, 0, 0, 1));
        // }
        //
        // const node = arc.child_node;
        // for (const next_arc of node.children_arcs) {
        //     this.debug(next_arc);
        // }
    }
}

class Node {
    constructor(name, shape, transform) {
        this.name = name;
        this.shape = shape;
        this.transform_matrix = transform;
        this.children_arcs = [];
    }
}

class Arc {
    constructor(name, parent, child, location) {
        this.name = name;
        this.parent_node = parent;
        this.child_node = child;
        this.location_matrix = location;
        this.articulation_matrix = Mat4.identity();
        this.end_effector = null;
        // Here I only implement rotational DOF
        this.dof = {
            Rx: false,
            Ry: false,
            Rz: false,
        }
    }

    // Here I only implement rotational DOF
    set_dof(x, y, z) {
        this.dof.Rx = x;
        this.dof.Ry = y;
        this.dof.Rz = z;
    }

    update_articulation(theta) {
        this.articulation_matrix = Mat4.identity();
        let index = 0;
        if (this.dof.Rx) {
            this.articulation_matrix.pre_multiply(Mat4.rotation(theta[index], 1, 0, 0));
            index += 1;
        }
        if (this.dof.Ry) {
            this.articulation_matrix.pre_multiply(Mat4.rotation(theta[index], 0, 1, 0));
            index += 1;
        }
        if (this.dof.Rz) {
            this.articulation_matrix.pre_multiply(Mat4.rotation(theta[index], 0, 0, 1));
        }
    }
}

// You are absoulutely free to modify this class, or add more classes.
class End_Effector {
    constructor(name, parent, local_position) {
        this.name = name;
        this.parent = parent;
        this.local_position = local_position;
        this.global_position = null;
    }
}