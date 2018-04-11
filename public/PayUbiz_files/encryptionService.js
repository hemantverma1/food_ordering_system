var encrypt = (function(){
    var encryptCardData = new JSEncrypt();
    var setPublicKey=function(publicKey){
        encryptCardData.setPublicKey(publicKey);
    };
    var encryptCardDetails=function(val){
        return encryptCardData.encrypt(val);
    };
    return {
        setPublicKey: setPublicKey,
        encryptCardDetails: encryptCardDetails,
    };
})();