(function() {
    var B = Backbone,
        Q = BackboneQuiz.QuizApp,
        M = Q.Models,
        C = Q.Collections,
        V = Q.Views,
        R = Q.Routes;
    
    R.Router = B.Router.extend({
        routes: {
            "/questions/:id": "questions",
            "*home": "home",
        },
        
        initialize: function(){
            Q._debug_info && console.info('Router.initialize', this);
            
        },
        
        home: function(){
            Q._debug_info && console.warn('Router.home', this);
            
            $('#questions-inner').html('\
                <input type="button" id="start-quiz" value="Start the Quiz">');
        },

        questions: function(id) {
            Q._debug_info && console.info('Router.questions', this);
            
            Q.MainView.render( id );
        }

    });

    Q.Router = new R.Router();
    Q.initialize();
    Backbone.history.start();
    

})();