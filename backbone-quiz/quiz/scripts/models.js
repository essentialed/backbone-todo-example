(function() {
    var B = Backbone,
        Q = BackboneQuiz.QuizApp,
        M = Q.Models,
        C = Q.Collections,
        V = Q.Views;
        
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
            return this.get('answer') == this.get('correct_answer');
        },
        has_next: function(){
            return this.collection.next(this);
        },
        has_prev: function(){
            return this.collection.prev(this);
        }
        
    });
    
    C.Questions = B.Collection.extend({
        model: M.Question,
        url: '/questions',
        localStorage: new Store('questions'),
        initialize: function(){
            Q._debug_info &&
                console.info('Collection.Questions.initialize', this);
            
            this.bind('add', function(model){
                Q._debug_info &&
                    console.info('Collection.Questions.add', model);
                
                model.save();
            }, this);
            
        },
        next: function(m){
            m = m || this.current_question;
            
            if(!m){return;}
            
            var i = this.indexOf( m );
            
            return this.at(i + 1);
        },
        prev: function(m){
            m = m || this.current_question;
            
            if(!m){return;}
            
            var i = this.indexOf( m );
            
            return this.at(i - 1);
        }
        
    });
    
})();