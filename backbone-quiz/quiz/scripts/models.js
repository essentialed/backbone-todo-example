(function() {
    var B = Backbone,
        Q = BackboneQuiz.QuizApp,
        M = Q.Models,
        C = Q.Collections,
        V = Q.Views;
    
    M.Account = B.Model.extend({
        url: '/account',
        localStorage: new Store("account"),
        defaults: {
            current_question: 0
        },
        
        initialize: function(){
            Q._debug_info &&
                console.info('Model.Account.initialize', this);
            
        }
    });
    
    M.Question = B.Model.extend({
        defaults: {
            intro_text: '',
            question: '',
            instructions: '',
            choices: null,
            answer: '',
            type: '',
            correct_answer: function() {}
        },
        
        initialize: function(){
            Q._debug_info &&
                console.info('Model.Question.initialize', this);
            
            this.set({
                'type': (this.get('choices')) ?
                    'multiple-choice' :
                    'question-answer'
            });
            
            return this;
        },
        
        validate: function(){
            if(!this.get('question')){ return 'Please provide a question'; }
        },
        
        answered: function(){
            return Boolean(this.get('answer'));
        },
        
        is_correct: function(){
            return this.get('answer') == this.correct_answer();
        }
        
    });
    
    C.Questions = B.Collection.extend({
        model: M.Question,
        url: '/questions',
        localStorage: new Store("questions"),
        initialize: function(){
            Q._debug_info &&
                console.info('Collection.Questions.initialize', this);
            
            this.bind('add', function(model){
                Q._debug_info &&
                    console.info('Collection.Questions.add', model);
                
                model.save();
            }, this);
            
            
        }
    });
    
})();