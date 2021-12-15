//----------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                       | |    | |               | | | |                     //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//                                                                            //
//  File      : demo_scene.mjs                                                //
//  Project   : lissajous                                                     //
//  Date      : 13 Dec, 21                                                    //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2021                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//
//----------------------------------------------------------------------------//
// Import                                                                     //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
import { luna }         from "../../libs/ark_luna/luna/luna.mjs";
import { Demo_Options } from "../demo_options.mjs"


class Curve
    extends luna.Container
{
    constructor(radius, ratio_1, ratio_2)
    {
        super();

        //
        // Points
        this.radius  = radius;
        this.size    = radius * 2;
        this.ratio_1 = ratio_1;
        this.ratio_2 = ratio_2;

        //
        // Graphics
        this.canvas_buffer = luna.Canvas_Utils.create_with_size(this.size, this.size);
        this.sprite        = luna.Sprite.from_canvas(this.canvas_buffer);
        luna.Layout.add_to_parent(this, this.sprite);

        document.body.appendChild(this.canvas_buffer);
    }

    //--------------------------------------------------------------------------
    _calculate_point_for_angle(angle)
    {
        const point = luna.make_vec2(
            this.radius * Math.cos(angle * (this.ratio_1 + 1)),
            this.radius * Math.sin(angle * (this.ratio_2 + 1)),
        );

        return point;
    }

   //---------------------------------------------------------------------------
    draw_to_angle(angle, segments,  stroke_color = "white", stroke_width = 2)
    {
        const ctx = this.canvas_buffer.context_2d;
        // ctx.save();

        ctx.strokeStyle = stroke_color;
        ctx.lineWidth   = stroke_width;

        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, this.size, this.size);
        ctx.beginPath();

        segments = 360;
        const angle_offset = luna.HALF_PI;
        const increment    = (luna.TWO_PI / segments);
        const target_angle = (angle - angle_offset);

        // Move the pen...
        let current_angle = -angle_offset;
        let point         = this._calculate_point_for_angle(current_angle);
        ctx.moveTo(this.radius + point.x, this.radius + point.y);

        // Draw the other lines...
        for(let i = 1; i < segments; ++i) {
            point = this._calculate_point_for_angle(current_angle);
            ctx.lineTo(this.radius + point.x, this.radius + point.y);

            current_angle += increment;
            if(current_angle > target_angle) {
                current_angle = target_angle;
                break;
            }
        }

        ctx.stroke ();
        ctx.restore();

        this.sprite.texture.update();
    }
}

//----------------------------------------------------------------------------//
// Demo_Scene                                                                 //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
export class Demo_Scene
    extends luna.Base_Scene
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();

        this.curves = null;
        this.current_angle  = Math.PI;

        this._create_curves();
    }

    //------------------------------------------------------------------------//
    // Events                                                                 //
    //------------------------------------------------------------------------//
    //--------------------------------------------------------------------------
    on_update(dt)
    {
        this.current_angle += dt;
        if(this.current_angle >= luna.TWO_PI) {
            this.current_angle -= luna.TWO_PI;
        }

        const segments = 30;
        for(let i = 0; i < this.curves.length; ++i) {
            const curve = this.curves[i];
            curve.draw_to_angle(this.current_angle, segments, "red");
        }
    }

    //------------------------------------------------------------------------//
    // Helpers                                                                //
    //------------------------------------------------------------------------//
    //--------------------------------------------------------------------------
    _create_curves()
    {
        const curves_count  = 3;
        const curves_radius = 80;
        const curves_size   = curves_radius * 2;
        const gap           = 10;

        this.curves = [];
        for(let i = 0; i < curves_count; ++i) {
            for(let j = 0; j < curves_count; ++j) {
                const ratio_1 = i;
                const ratio_2 = j;
                const curve = new Curve(curves_radius, ratio_1, ratio_2);
                curve.x = curves_radius + (i * curves_size) + (i * gap);
                curve.y = curves_radius + (j * curves_size) + (j * gap);

                luna.Layout.add_to_parent(this, curve);
                this.curves.push(curve);
            }
        }
    }
}