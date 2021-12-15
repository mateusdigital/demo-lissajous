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
    constructor()
    {
        super();

        //
        // Points
        this.points = [];

        const angles_count = 360;
        const radius       = 100;

        for(let degrees = 0; degrees < angles_count; ++degrees) {
            const radian = luna.Math_Utils.to_radians(degrees);
            const point  = luna.make_vec2(
               radius * Math.cos(radian),
               radius * Math.sin(radian),
            );
            this.points.push(point);
        }

        //
        // Graphics
        this.graphics = new PIXI.Graphics();

        this.graphics.lineStyle(2, 0xFFFFFF, 1);
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
        const curve = new Curve();
        curve.x = 100;
        curve.y = 100;
        luna.Layout.add_to_parent(this, curve);
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