const Main = imports.ui.main;
const Meta = imports.gi.Meta;
const Lang = imports.lang;
const Tweener = imports.ui.tweener;
const ExtensionSystem = imports.ui.extensionSystem;
const ExtensionUtils = imports.misc.extensionUtils;


const CONLICT_UUID = ["window-fade-in@suhy17.gmail.com"];
const WINDOW_ANIMATION_TIME = 0.2; // I don't know why, but 0.2 must be (in another value after scaling window is blu)
const WINDOW_SCALE = 0.30;

const FadeInForWindow = new Lang.Class({
    
    Name: "FadeInForWindow",
    
    _init: function (){
        
        this._display =  global.screen.get_display();
        
        this.signalConnectID = this._display.connect('window-created', Lang.bind(this, this._FadeIn));

        global._fade_in_aminator = this;
        
    },
    _FadeIn : function (display,window){
        
        if (!window.maximized_horizontally && window.get_window_type() == Meta.WindowType.NORMAL){
            let actor = window.get_compositor_private();
            
            [width,height] = actor.get_size();
            [prevX,prevY] = actor.get_position();
            
            // Initial values
            let start_x = prevX+(width/2-width*WINDOW_SCALE/2);
            let start_y = prevY+(height/2-height*WINDOW_SCALE/2);
            actor.set_scale(WINDOW_SCALE,WINDOW_SCALE);
            actor.set_opacity(150);
            actor.set_position(start_x,start_y);

            Tweener.addTween(actor,{
                             opacity: 255,
                             x:prevX,
                             y:prevY,
                             scale_x:1,
                             scale_y:1,
                             time: WINDOW_ANIMATION_TIME,
                             transition: 'easeOutQuint',
                             onComplete:this._animationDone,
                             onCompleteScope : this,
                             onCompleteParams:[actor,prevX,prevY],
                             onOverwrite : this._animationDone,
                             onOverwriteScope : this,
                             onOverwriteParams: [actor,prevX,prevY]
                            });
        };
    },
    _animationDone : function (actor){
        actor.set_scale(1.0,1.0);
    },
    destroy : function (){
        delete global._fade_in_aminator;
        this._display.disconnect(this.signalConnectID);
    },
    _onDestroy : function (){
        this.destroy();
    }
});

let fademaker = null;
let metadata = null;

function enable() {
    // check conflict extension
    for (var item in ExtensionUtils.extensions){
        
        if (CONLICT_UUID.indexOf(item.uuid) >= 0 && item.state == ExtensionSystem.ExtensionState.ENABLED){
            throw new Error('%s conflict with %s'.format(item,metadata.uuid));
            scalemaker = 'CONFLICTED';
        }
        
    }
    
    if (fademaker == null){
        fademaker = new FadeInForWindow();
    }
}
function disable() {
    if (fademaker != null){
        fademaker.destroy();
        fademaker = null;
    }
}
function init(metadataSource) {
    metadata = metadataSource;
}
