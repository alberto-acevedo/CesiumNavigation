/*global define*/
define([
    'Cesium/Core/defined',
    'Cesium/Core/defineProperties',
//    'Cesium/Core/defaultValue',
    'Cesium/Core/Event',
    'KnockoutES5',
    'Core/registerKnockoutBindings',
    'ViewModels/DistanceLegendViewModel',
    'ViewModels/NavigationViewModel'
], function (
    defined,
    defineProperties,
//    defaultValue,
    CesiumEvent,
    Knockout,
    registerKnockoutBindings,
    DistanceLegendViewModel,
    NavigationViewModel) {
    'use strict';

    /**
     * @alias CesiumNavigation
     * @constructor
     *
     * @param {CesiumWidget} cesiumWidget The CesiumWidget instance
     */
    var CesiumNavigation = function (cesiumWidget) {
        initialize.apply(this, arguments);

        this._onDestroyListeners = [];
    };

    CesiumNavigation.prototype.distanceLegendViewModel = undefined;
    CesiumNavigation.prototype.navigationViewModel = undefined;
    CesiumNavigation.prototype.navigationDiv = undefined;
    CesiumNavigation.prototype.distanceLegendDiv = undefined;
    CesiumNavigation.prototype.terria = undefined;
    CesiumNavigation.prototype.container = undefined;
    CesiumNavigation.prototype._onDestroyListeners = undefined;

    CesiumNavigation.prototype.destroy = function () {
        if (defined(this.navigationViewModel)) {
            this.navigationViewModel.destroy();
        }
        if (defined(this.distanceLegendViewModel)) {
            this.distanceLegendViewModel.destroy();
        }

        if (defined(this.navigationDiv)) {
            this.navigationDiv.parentNode.removeChild(this.navigationDiv);
        }
        delete this.navigationDiv;

        if (defined(this.distanceLegendDiv)) {
            this.distanceLegendDiv.parentNode.removeChild(this.distanceLegendDiv);
        }
        delete this.distanceLegendDiv;

        if (defined(this.container)) {
            this.container.parentNode.removeChild(this.container);
        }
        delete this.container;

        for (var i = 0; i < this._onDestroyListeners.length; i++) {
            this._onDestroyListeners[i]();
        }
    };

    CesiumNavigation.prototype.addOnDestroyListener = function (callback) {
        if (typeof callback === "function") {
            this._onDestroyListeners.push(callback);
        }
    };

    function initialize(cesiumWidget, options) {
        if (!defined(cesiumWidget)) {
            throw new DeveloperError('cesiumWidget is required.');
        }

//        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        var container = document.createElement('div');
        container.className = 'cesium-widget-cesiumNavigationContainer';
        cesiumWidget.container.appendChild(container);

        this.terria = cesiumWidget;
        this.terria.afterWidgetChanged = new CesiumEvent();
        this.terria.beforeWidgetChanged = new CesiumEvent();
        this.container = container;
        this.navigationDiv = document.createElement('div');
        this.navigationDiv.setAttribute("id", "navigationDiv");
//        this.navigationDiv.style.display = "inline-block";
//        this.navigationDiv.style.margin = "2px";
//        this.navigationDiv.style.position = "absolute";
//        this.navigationDiv.style.right = "0px";
//        this.navigationDiv.style.height = "45px";
//        this.navigationDiv.style.top = "34px";
//        this.navigationDiv.style.zIndex = "300";
//        navigationDiv.style.border = "3px solid #8AC007";


        this.distanceLegendDiv = document.createElement('div');
        this.navigationDiv.setAttribute("id", "distanceLegendDiv");
//        this.navigationDiv.style.display = "inline-block";
//        this.navigationDiv.style.margin = "2px";
//        this.navigationDiv.style.position = "absolute";
//        this.navigationDiv.style.right = "57px";
//        this.navigationDiv.style.top = "30px";
//        this.navigationDiv.style.zIndex = "300";

//        var mapContainer = document.getElementById(emp.map.container.get());
        container.appendChild(this.navigationDiv);
        container.appendChild(this.distanceLegendDiv);


        // Register custom Knockout.js bindings.  If you're not using the TerriaJS user interface, you can remove this.
        registerKnockoutBindings();

        this.distanceLegendViewModel = DistanceLegendViewModel.create({
            container: this.distanceLegendDiv,
            terria: this.terria,
            mapElement: container
        });

        // Create the navigation controls.
        this.navigationViewModel = NavigationViewModel.create({
            container: this.navigationDiv,
            terria: this.terria
        });
    }

    return CesiumNavigation;
});


