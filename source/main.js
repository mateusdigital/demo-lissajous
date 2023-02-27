//----------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                       | |    | |               | | | |                     //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//                                                                            //
//  File      : main.mjs                                                      //
//  Project   : lissajous                                                     //
//  Date      : 14 Dec, 21                                                    //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2021                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//


//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
__SOURCES = [
    "/modules/demolib/modules/external/chroma.js",
    "/modules/demolib/modules/external/gif.js/gif.js",

    "/modules/demolib/source/demolib.js",
];

class Curve
{
    constructor(radius, ratio_1, ratio_2)
    {
        //
        // Points
        this.radius  = radius;
        this.size    = (radius * 2);
        this.ratio_1 = ratio_1;
        this.ratio_2 = ratio_2;

        //
        // Graphics
        this.canvas_buffer = null;
    }

    //--------------------------------------------------------------------------
    _calculate_point_for_angle(angle)
    {
        const point = make_vec2(
            this.radius * Math.cos(angle * (this.ratio_1 + 1)),
            this.radius * Math.sin(angle * (this.ratio_2 + 1)),
        );

        return point;
    }

    //--------------------------------------------------------------------------
    draw_to_angle(angle, segments,  stroke_color = "white", stroke_width = 2)
    {
        const ctx = get_main_canvas_context();
        ctx.save();
            ctx.strokeStyle = stroke_color;
            ctx.lineWidth   = stroke_width;

            // ctx.fillStyle = "blue";
            // ctx.fillRect(0, 0, this.size, this.size);
            ctx.clearRect(0, 0, this.size, this.size);
            ctx.beginPath();

            segments = 360;
            const angle_offset = HALF_PI;
            const increment    = (TWO_PI / segments);
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
    }
}

//----------------------------------------------------------------------------//
// Demo_Scene                                                                 //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class Demo_Scene
{
    //--------------------------------------------------------------------------
    constructor()
    {
        this.rows = 10;
        this.cols = 10;

        this.curves        = create_2d_array(this.rows, this.cols);
        this.current_angle = 0;

        this.ratio_1 = 0;
        this.ratio_2 = 0;
        this.ratio_1_incr = 0;
        this.ratio_2_incr = 2;

        for(let i = 0; i < this.curves.length; ++i) {
            for(let j = 0; j < this.curves[i].length; ++j) {
                const ratio_1 = (i + 1);
                const ratio_2 = (j + 1);

                const radius = 100;
                this.curves[i][j] = new Curve(radius, ratio_1, ratio_2);
            }
        }
    }

    //------------------------------------------------------------------------//
    // Events                                                                 //
    //------------------------------------------------------------------------//
    //--------------------------------------------------------------------------
    on_update(dt)
    {
        let should_restart = false;

        this.current_angle += dt;
        if(this.current_angle >= TWO_PI) {
            this.current_angle -= TWO_PI;
            should_restart = true;
        }

        const segments = 30;
        for(let i = 0; i < this.curves.length; ++i) {
            for(let j = 0; j < this.curves[i].length; ++j) {
                const curve = this.curves[i][j];
                if(!curve) {
                    continue;
                }

                const x = j * curve.size;
                const y = i * curve.size;

                begin_draw();
                    translate_canvas(x, y);
                    curve.draw_to_angle(this.current_angle, segments, "red");
                end_draw();
            }
        }

        if(should_restart) {
            restart();
        }
    }
}

//----------------------------------------------------------------------------//
// Variables                                                                  //
//----------------------------------------------------------------------------//
let demo = null;

//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function setup_standalone_mode()
{
    return new Promise((resolve, reject)=>{
        demolib_load_all_scripts(__SOURCES).then(()=> { // Download all needed scripts.
            // Create the standalone canvas.
            const canvas = document.createElement("canvas");

            canvas.width            = window.innerWidth;
            canvas.height           = window.innerHeight;
            canvas.style.position   = "fixed";
            canvas.style.left       = "0px";
            canvas.style.top        = "0px";
            canvas.style.zIndex     = "-100";

            document.body.appendChild(canvas);

            // Setup the listener for gif recording.
            gif_setup_listeners();

            resolve(canvas);
        });
    });
}

//------------------------------------------------------------------------------
function setup_common(canvas)
{
    set_random_seed();
    set_main_canvas(canvas);

    demo = new Demo_Scene();

    start_draw_loop(draw);
}



//------------------------------------------------------------------------------
function demo_main(user_canvas)
{
    if(!user_canvas) {
        setup_standalone_mode().then((canvas)=>{
            setup_common(canvas);
        });
    } else {
        canvas = user_canvas;
        setup_common();
    }

}

//------------------------------------------------------------------------------
function draw(dt)
{
    begin_draw();
        demo.on_update(dt);
    end_draw();
}
