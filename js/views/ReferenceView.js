// Category View
// =============

// Includes file dependencies
define([ "jquery", "backbone","models/ReferenceModel" ], function( $, Backbone, ReferenceModel ) {

    // Extends Backbone.View
    var ReferenceView = Backbone.View.extend( {

        // The View Constructor
        initialize: function() {

            // The render method is called when Category Models are added to the Collection
            this.collection.on( "added", this.render, this );

        },

        // Renders all of the Category models on the UI
        render: function() {

            // Sets the view's template property
            this.template = _.template( $( "script#categoryItems" ).html(), { "collection": this.collection } );

            // Renders the view's template inside of the current listview element
            this.$el.find("#reference-panel").html(this.template);

            // Maintains chainability
            return this;

        }

    } );

    // Returns the View class
    return ReferenceView;

} );