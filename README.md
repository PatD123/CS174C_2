# Articulated Human

https://github.com/user-attachments/assets/0f2dc801-726b-4428-b87f-d427a57a0cec

1. Display classroom in the render_animation() function of class Assignment2 starting from line 152.
2. Spline is created on line 53 and drawn in the same function as above (line 166)
3. Articulated human is located in the human.js file.
4. All relevant functions relating to the IK process such as finding the Jacobian and the Pseudoinverse.
5. In the same render_animation function, I loop through all the jobs (the points we need to trace out) and we just loop through them and the arm moves.

`update_delta_theta` : Updates the joint values after doing the IK process, where we know by how much to rotate each joint.

`apply_theta` : Updates the joints by the tine epsilon amt to calc Jacobian.

`calculate_Jacobian` : Calculates the Jacobian

`calculate_delta_theta` : Finding pseudoinverse and multiplying it with dx to get by how much we should change the thetas of the joints.

`get_end_effector_position` : Uses the func below to get ef pos.

`_rec_update` : Finds the end effector position via recursion
