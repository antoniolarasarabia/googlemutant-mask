import 'leaflet.gridlayer.googlemutant';
import * as Util from "leaflet/src/core/Util";
import * as DomUtil from "leaflet/src/dom/DomUtil";
import {Bounds, Point} from "leaflet/src/geometry";
import * as Browser from "leaflet/src/core/Browser";

(function() {

  var defaultMaskUrl = [
    'data:image/png;base64,',
    'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAC7lBMVEUAAAABAQECAgIDAwMEBAQF',
    'BQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcY',
    'GBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKior',
    'KyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+',
    'Pj4/Pz9AQEBBQUFCQkJDQ0NERERGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFS',
    'UlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRl',
    'ZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29xcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5',
    'eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYGCgoKDg4OEhISFhYWGhoaHh4eIiIiKioqLi4uMjIyN',
    'jY2Ojo6Pj4+QkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5+g',
    'oKChoaGioqKkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0',
    'tLS1tbW2tra3t7e4uLi5ubm6urq7u7u9vb2+vr6/v7/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fI',
    'yMjJycnKysrLy8vMzMzNzc3Pz8/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trb29vc',
    '3Nzd3d3e3t7f39/g4ODh4eHi4uLj4+Pk5OTl5eXm5ubn5+fo6Ojp6enq6urr6+vs7Ozt7e3u7u7v',
    '7+/w8PDx8fHy8vLz8/P09PT19fX29vb39/f4+Pj5+fn6+vr7+/v8/Pz9/f3+/v7///9A5nLSAAAA',
    'AWJLR0QAiAUdSAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB98FHBEuKjDLarAAAAAdaVRY',
    'dENvbW1lbnQAAAAAAENyZWF0ZWQgd2l0aCBHSU1QZC5lBwAAAjNJREFUOMtjYEACjExMLCzMTIwM',
    '2AETK7eQhIyslAgvOzM2aU4xTbvAhMyspFAXPWkedCWM7GJGYVUz1+0+fGTfpvnNCdYynEwo8twq',
    'fo1rTt978fbDh3evHl7c1hOty49kCCOPTtK8U08+fPvx4+fPnz++fXpxaXWhhRAzQr9O5uob7779',
    'hIPvHx/sqLISgNnCrpK8+s6nHz+RwI8vT3aVGnJDPMwk5jfvBqo8SMWjDUkKrGAFnEYNJ9+hyQNV',
    'fLo+zUUAZASTeNjaJ99+YoDvr/flKLEAFbBpVp368BML+HJzohU3UAG33Yy7X7Ep+P58XZAwEwOT',
    'UOC65z+wKfj5/lCmLDMDk0T87rfYFXw6W6HGysAik3kYqxOAjrjcpM3GwCKbdQSXgivNOuwMTFLJ',
    '+95ht+Lz+Wp1VgYmkdBNL7Er+HA0V56FgZHXef7Db9jkf7zaEikGjC92vaYLn7Ap+HpvliMPMKyZ',
    'peO3vfiOxYB3x8s02ECRxWPdc+kjpiu+3FvoKwJOESwy0asefEGX//Zid74GOyTBcOoW7njyFdWM',
    'b6+Ot9rwQ3MIE79F9a5Hn74jJ5cXx3vcxeCJklnIqnTD9TdfoEp+fH13b3ebuxQrIlkzCxgmTdt3',
    '4/n7T1++fP7w6u6xhfk24qwo+YpbwSVn4rqDZy9fOX90y6wyXw1+tLzFyMqvZBWcUdHUXJ0b6agh',
    'zI6ZgxlZuIRlVbW11eXFeFhxZHAmZlY2dlYWlPwPAD6nKPWk11d/AAAAAElFTkSuQmCC'
  ].join("");

  L.GridLayer.GoogleMutant.Mask = L.GridLayer.GoogleMutant.extend({
     options: {
      maskUrl: defaultMaskUrl,
      maskSize: 512
    },
    getMaskSize: function() {
      var s = this.options.maskSize;
      return s instanceof L.Point ? s : new L.Point(s, s);
    },
    setCenter: function(containerPoint) {
      if (arguments.length === 2) {
        this.setCenter(L.point(arguments[0], arguments[1]));
        return;
      }
      if (this._map) {
        var p = this._map.containerPointToLayerPoint(containerPoint);
        p = p.subtract(this.getMaskSize().divideBy(2));
        this._image.setAttribute("x", p.x);
        this._image.setAttribute("y", p.y);
      }
    },
    _initContainer: function() {
      if (this._container) return;
      var rootGroup = this._map.getRenderer(this)._rootGroup;
      var defs = rootGroup.appendChild(L.SVG.create("defs"));
      var container = rootGroup.appendChild(L.SVG.create("g"));
      var mask = defs.appendChild(L.SVG.create("mask"));
      var image = mask.appendChild(L.SVG.create("image"));
      var size = this.getMaskSize();
      mask.setAttribute("id", "leaflet-tilelayer-mask-" + L.stamp(this));
      mask.setAttribute("x","-100%");
      mask.setAttribute("y","-100%");
      mask.setAttribute("width","300%");
      mask.setAttribute("height","300%");
      image.setAttribute("width", size.x);
      image.setAttribute("height", size.y);
      image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", this.options.maskUrl);
      container.setAttribute("mask", "url(#" + mask.getAttribute("id") + ")");
      var text = container.appendChild(L.SVG.create("text"));
      text.setAttribute("text", "hola k tal");
      text.setAttribute("x", 380);
      text.setAttribute("y", 350);
      this._container = container;
      this._image = image;
      this.setCenter(this._map.getSize().divideBy(2));

    },
      _update: function () {
		// zoom level check needs to happen before super's implementation (tile addition/creation)
		// otherwise tiles may be missed if maxNativeZoom is not yet correctly determined
		if (this._mutant) {
			var center = this._map.getCenter();
			var _center = new google.maps.LatLng(center.lat, center.lng);

			this._mutant.setCenter(_center);
			var zoom = this._map.getZoom();
			var fractionalLevel = zoom !== Math.round(zoom);
			var mutantZoom = this._mutant.getZoom();

			//ignore fractional zoom levels
			if (!fractionalLevel && (zoom != mutantZoom)) {
				this._mutant.setZoom(zoom);

				if (this._mutantIsReady) this._checkZoomLevels();
				//else zoom level check will be done later by 'idle' handler
			}
		}
		this._updateTest();
	},

    _updateTest: function (center) {
		var map = this._map;
		if (!map) { return; }
		var zoom = this._clampZoom(map.getZoom());

		if (center === undefined) { center = map.getCenter(); }
		if (this._tileZoom === undefined) { return; }	// if out of minzoom/maxzoom

		var pixelBounds = this._getTiledPixelBounds(center),
		    tileRange = this._pxBoundsToTileRange(pixelBounds),
		    tileCenter = tileRange.getCenter(),
		    queue = [],
		    margin = this.options.keepBuffer,
		    noPruneRange = new Bounds(tileRange.getBottomLeft().subtract([margin, -margin]),
		                              tileRange.getTopRight().add([margin, -margin]));

		// Sanity check: panic if the tile range contains Infinity somewhere.
		if (!(isFinite(tileRange.min.x) &&
		      isFinite(tileRange.min.y) &&
		      isFinite(tileRange.max.x) &&
		      isFinite(tileRange.max.y))) { throw new Error('Attempted to load an infinite number of tiles'); }

		for (var key in this._tiles) {
			var c = this._tiles[key].coords;
			if (c.z !== this._tileZoom || !noPruneRange.contains(new Point(c.x, c.y))) {
				this._tiles[key].current = false;
			}
		}

		// _update just loads more tiles. If the tile zoom level differs too much
		// from the map's, let _setView reset levels and prune old tiles.
		if (Math.abs(zoom - this._tileZoom) > 1) { this._setView(center, zoom); return; }

		// create a queue of coordinates to load tiles from
		for (var j = tileRange.min.y; j <= tileRange.max.y; j++) {
			for (var i = tileRange.min.x; i <= tileRange.max.x; i++) {
				var coords = new Point(i, j);
				coords.z = this._tileZoom;

				if (!this._isValidTile(coords)) { continue; }

				var tile = this._tiles[this._tileCoordsToKey(coords)];
				if (tile) {
					tile.current = true;
				} else {
					queue.push(coords);
				}
			}
		}

		// sort tile queue to load tiles in order of their distance to center
		queue.sort(function (a, b) {
			return a.distanceTo(tileCenter) - b.distanceTo(tileCenter);
		});

		if (queue.length !== 0) {
			// if it's the first batch of tiles to load
			if (!this._loading) {
				this._loading = true;
				// @event loading: Event
				// Fired when the grid layer starts loading tiles.
				this.fire('loading');
			}

			// create DOM fragment to append tiles in one batch
			this._fragment = document.createDocumentFragment();

			for (i = 0; i < queue.length; i++) {
				this._addTile(queue[i], this._fragment);
			}

			// this._level.el.appendChild(fragment);
		}
	},

      _addTile: function (coords, container) {
		var tilePos = this._getTilePos(coords),
		    key = this._tileCoordsToKey(coords);


		var tilePos = this._getTilePos(coords);
        var tileSize = this.getTileSize();
        var key = this._tileCoordsToKey(coords);
        // var url = this.getTileUrl(this._wrapCoords(coords));


		// const test = document.getElementsByClassName("leaflet-tile-container");
      // console.log('test vale');
      // console.log(test[0].childNodes.length);
      //
      // const other_test = test[0].cloneNode(true);

      // for (var i = 0; i < other_test.childNodes.length; i++) {
      //     console.log('esta prueba vale');
      //     console.log(other_test.childNodes[i].children[0].src);
          // var tile_prueba = document.createElement('img');
          // tile_prueba.src = other_test.childNodes[i].children[0].src;
          // tile_prueba.setAttribute("x", 380);
          // tile_prueba.setAttribute("y", 350);
          // tile_prueba.setAttribute("width", 256);
          // tile_prueba.setAttribute("height", 256);
          // tile_prueba.setAttribute("href", other_test.childNodes[i].children[0].src);
          //   var otra_pruee = document.createElement("text");
          //   otra_pruee.setAttribute("x", 380);
          //   otra_pruee.setAttribute("y", 350);
          //   otra_pruee.setAttribute("text-content", 'HOLAAA');
          //   otra_pruee.setAttribute("z-index", '800');
          // var test_tile = container.appendChild(otra_pruee);


      // }

		var tile = this.createTile(this._wrapCoords(coords), Util.bind(this._tileReady, this, coords));

		this._initTile(tile);

		// if createTile is defined with a second argument ("done" callback),
		// we know that tile is async and will be ready later; otherwise
		if (this.createTile.length < 2) {
			// mark tile as ready, but delay one frame for opacity animation to happen
			Util.requestAnimFrame(Util.bind(this._tileReady, this, coords, null, tile));
		}

		DomUtil.setPosition(tile, tilePos);

		// save tile in cache
		this._tiles[key] = {
			el: tile,
			coords: coords,
			current: true
		};

        console.log('tilesize vale');
        console.log(tileSize);
		// var text = container.appendChild(L.SVG.create("image"));
        // text.setAttribute("href", "https://placekitten.com/256/256?image=2");
        // text.setAttribute("x", tilePos.x);
        // text.setAttribute("y", tilePos.y);
        // text.setAttribute("width", tileSize.x);
        // text.setAttribute("height", tileSize.y);

        console.log('SE LLAMA ADD TILE');
        // setTimeout(function() {
        //     var test_tile = container.appendChild(tile.children[0]);
        //     test_tile.setAttribute("width", 256);
        //     test_tile.setAttribute("height", 256);
        //     test_tile.setAttribute("x", tilePos.x);
        //     test_tile.setAttribute("y", tilePos.y);
        //      }, 3000);


		// this._container.appendChild(tile);
		// @event tileloadstart: TileEvent
		// Fired when a tile is requested and starts loading.
		// this.fire('tileloadstart', {
		// 	tile: tile,
		// 	coords: coords
		// });
	},

      _tileReady: function (coords, err, tile) {
		if (!this._map) { return; }

		if (err) {
			// @event tileerror: TileErrorEvent
			// Fired when there is an error loading a tile.
			this.fire('tileerror', {
				error: err,
				tile: tile,
				coords: coords
			});
		}

		var key = this._tileCoordsToKey(coords);

		tile = this._tiles[key];
		if (!tile) { return; }

		console.log('SE LLAMA TILE READY');

		tile.loaded = +new Date();
		if (this._map._fadeAnimated) {
			DomUtil.setOpacity(tile.el, 0);
			Util.cancelAnimFrame(this._fadeFrame);
			this._fadeFrame = Util.requestAnimFrame(this._updateOpacity, this);
		} else {
			tile.active = true;
			this._pruneTiles();
		}

		if (!err) {
			DomUtil.addClass(tile.el, 'leaflet-tile-loaded');

			// @event tileload: TileEvent
			// Fired when a tile loads.
			this.fire('tileload', {
				tile: tile.el,
				coords: coords
			});
		}

		if (this._noTilesToLoad()) {
			this._loading = false;
			// @event load: Event
			// Fired when the grid layer loaded all visible tiles.
			this.fire('load');

			this._test();

			if (Browser.ielt9 || !this._map._fadeAnimated) {
				Util.requestAnimFrame(this._pruneTiles, this);
			} else {
				// Wait a bit more than 0.2 secs (the duration of the tile fade-in)
				// to trigger a pruning.
				setTimeout(Util.bind(this._pruneTiles, this), 250);
			}
		}
	},

      _test() {
         console.log('SE LLAMA A TEST!!!!');
         console.log('this_tiles vale');
         console.log(this._tiles.length);

         for (var key in this._tiles) {
             var coords = this._tiles[key].coords
             var tilePos = this._getTilePos(coords);
            var tileSize = this.getTileSize();
            var key = this._tileCoordsToKey(coords);
             var text = this._fragment.appendChild(L.SVG.create("image"));
            text.setAttribute("href", this._tiles[key].el.children[0].src);
            text.setAttribute("x", tilePos.x);
            text.setAttribute("y", tilePos.y);
            text.setAttribute("width", tileSize.x);
            text.setAttribute("height", tileSize.y);
             console.log(this._tiles[key].el.children[0].src);
         }

         console.log('SE LLAMA UPDATE TEST');

            this._container.appendChild(this._fragment);
      }

  });

  L.GridLayer.GoogleMutant.mask = function(data, options) {
    return new L.GridLayer.GoogleMutant.Mask(data, options);
  };

})();
