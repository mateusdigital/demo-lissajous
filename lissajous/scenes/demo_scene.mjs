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
    constructor(radius, i, j)
    {
        super();

        //
        // Points
        this.points = [];
        this.radius = radius;

        const angles_count = 360;
        for(let degrees = 0; degrees < angles_count; ++degrees) {
            const radian = luna.Math_Utils.to_radians(degrees);
            const point  = luna.make_vec2(
               this.radius * Math.cos(radian * (j + 1)),
               this.radius * Math.sin(radian * (i + 1)),
            );
            this.points.push(point);
        }

        //
        // Graphics
        this.graphics = new PIXI.Graphics();

        this.graphics.lineStyle(1, 0xFFFFFF, 1);
        this.graphics.beginFill(0, 0);
        this.graphics.drawPolygon(this.points);
        this.graphics.endFill();
        luna.Layout.add_to_parent(this, this.graphics);
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

        const size = luna.App.get_size();

        const curves_count  = 10;
        const curves_radius = 10;
        const curves_size   = curves_radius * 2;
        const gap           = 10;
        for(let i = 0; i < curves_count; ++i) {
            for(let j = 0; j < curves_count; ++j) {
                const curve = new Curve(curves_radius, i, j);
                curve.x =curves_radius + (i * curves_size) + (i * gap);
                curve.y =curves_radius + (j * curves_size) + (j * gap);
                luna.Layout.add_to_parent(this, curve);
            }
        }
    }

    //------------------------------------------------------------------------//
    // Events                                                                 //
    //------------------------------------------------------------------------//
    //--------------------------------------------------------------------------
    on_update(dt)
    {
    }

    //--------------------------------------------------------------------------
    on_resize()
    {
        luna.log_verbose(luna.App.get_size());
    }

    //------------------------------------------------------------------------//
    // Helpers                                                                //
    //------------------------------------------------------------------------//
    //--------------------------------------------------------------------------
    _setup_graphics()
    {
        // Create the canvas that we gonna draw...
        this._buffer_canvas        = document.createElement("canvas");
        this._buffer_canvas.width  = Demo_Options.FIRE_WIDTH;
        this._buffer_canvas.height = Demo_Options.FIRE_HEIGHT;

        this._buffer_context = this._buffer_canvas.getContext("2d");

        // Create a sprite that we can render...
        const texture = PIXI.Texture.from(this._buffer_canvas);

        this._sprite               = luna.RES.create_sprite_with_texture(texture);
        this._sprite.cacheAsBitmap = false;
        this._sprite.width         = luna.App.get_size().width;
        this._sprite.height        = luna.App.get_size().height;

        luna.Layout.add_to_parent(this, this._sprite);
    }
}