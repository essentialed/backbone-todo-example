(function() {
    var B = Backbone,
        Q = BackboneQuiz.QuizApp,
        M = Q.Models,
        C = Q.Collections,
        V = Q.Views,
        R = Q.Routes;
    
    R.Router = B.Router.extend({
        routes: {
            "/": "home",
            "/questions/:id": "questions"
        },
        
        initialize: function(){
            Q._debug_info && console.info('Router.initialize', this);
            
            Q.initialize();
        },
        
        home: function(){
            Q._debug_info && console.info('Router.home', this);
            
        },

        questions: function(id) {
            Q._debug_info && console.info('Router.questions', this);
            
        }

    });
    new R.Router();
    Backbone.history.start();

})();