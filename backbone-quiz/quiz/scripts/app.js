var BackboneQuiz = BackboneQuiz || {};
var console = (function(undefined) {
    var m = ['log', 'error', 'info', 'warn', 'time','timeEnd', 'dir'];
    if(typeof window.console === undefined) {
        var c = {}, f = function() {};
        for (var i=0, l = m.length; i < l; i++) {
            c[m[i]] = f;
        }
        return c;
    }
    return window.console;
})();

(function() {
    var Q = BackboneQuiz.QuizApp = {
        Models: {},
        Collections: {},
        Views: {},
        Routes: {},
        _initialized: false,
        _debug_info: true,
        _questions: [
            {
                id: 0,
                question: 'Which framework does this example use?',
                intro_text: 'Is it Spine or Backbone?',
                instructions: 'Choose one of the following',
                choices: {
                    '0': {
                        'text': 'Backbone'
                    },
                    '1': {
                        'text': 'Spine'
                    },
                    '2': {
                        'text': 'Neither'
                    }
                },
                correct_answer: '0'
                
            },
            {
                id: 1,
                question: 'What\'s 4 + 2 ',
                intro_text: '',
                instructions: 'Type your answer in the box below',
                correct_answer: '6'
                
            }
        ],
        
        initialize: function(){
            if(this._initialized){ return this; }
            
            var q,
                self = this,
                qs = this._questions;
            
            this._debug_info &&
                console.info('BackboneQuiz.QuizApp.initialize', this);
            
            this._initialized = true;
            this._template = $('#templates');
            
            q = this.Questions = new Q.Collections.Questions();
            
            q.fetch({
                success: function(questions){
                    if(q.length !== qs.length){
                       q.add(qs.slice(q.length,qs.length));
                    }
                    
                    self.start();
                }
            });
            
            return this;
        },
        start: function(){
            this.MainView = new Q.Views.AppView({
                collection: this.Questions
            });
            
            this.ProgressView = new Q.Views.ProgressView({
                collection: this.Questions
            });
            
        }
    };

})();