var ASQ = window.ASQ = {

  // From Polymer/core-focusable
  // @see https://github.com/Polymer/core-focusable.git
  mixin2 : function(prototype, mixin) {

    // adds a single mixin to prototype

    if (mixin.mixinPublish) {
      prototype.publish = prototype.publish || {};
      Polymer.mixin(prototype.publish, mixin.mixinPublish);
    }

    if (mixin.mixinDelegates) {
      prototype.eventDelegates = prototype.eventDelegates || {};
      for (var e in mixin.mixinDelegates) {
        if (!prototype.eventDelegates[e]) {
          prototype.eventDelegates[e] = mixin.mixinDelegates[e];
        }
      }
    }

    if (mixin.mixinObserve) {
      prototype.observe = prototype.observe || {};
      for (var o in mixin.mixinObserve) {
        if (!prototype.observe[o] && !prototype[o + 'Changed']) {
          prototype.observe[o] = mixin.mixinObserve[o];
        }
      }
    }

    Polymer.mixin(prototype, mixin);

    delete prototype.mixinPublish;
    delete prototype.mixinDelegates;
    delete prototype.mixinObserve;

    return prototype;
  },

  /**
   *
   * This mixin object is for every ASQ element type, including question types and others.
   *
   **/
  ElementTypeMixin : {

    // True for every ASQ element.
    isASQElement : true,

    // Denotes whether an ASQ element is a `question type`. 
    isASQQuestionTypeElement : false,

    mixinPublish: {
      // 
      uid: {value: "", reflect: true},
    },
  },

  /**
   *
   * This mixin object is `ONLY` for question types.
   *
   **/
  QuestionTypeMixin : {
    isASQQuestionTypeElement : true,
  },


  RoleMixin : {
    // use a simple enum object
    roles: Object.freeze({
      VIEWER: "viewer",
      PRESENTER: "presenter",
      TA: "ta"
    }),

    mixinPublish: {
      // default role is 'viewer'
      role: {value: "viewer", reflect: true}
    },

    isValidRole: function(role) {
      var roles = ASQ.RoleMixin.roles;
      for (var r in roles) {
        if (roles.hasOwnProperty(r)) {
          if ( role == roles[r] ) {
            return true;
          }
        }
      }
      return false;
    },

    setANF: function() {

    },

    /**
     * 
     * 1. Validate the updation of role. If the new value
     * is not a valid one, then roll back to the old value.
     * 
     * 2. If the role of `outside` element is 
     * changed, then `inside` elements' role
     * are also changed.
     *
     **/
    roleChanged: function(old, newRole) {
      if ( this.isValidRole(newRole) ) {
        if ( old != newRole ) {
          this.childNodes.array().filter(function(el) {
            return el.isASQElement;
          }).forEach(function(x) {
            x.role = newRole;
          });

          // redo the $
        }
      } else {
        this.role = old;
      }
    }
  },


  // sugar function for mixin.
  asqify : function(p, isQuestionType){
    this.mixin2(p, this.RoleMixin);
    this.mixin2(p, this.ElementTypeMixin);

    if(isQuestionType){
      p.isASQQuestionTypeElement = true;
    }
  }

};

