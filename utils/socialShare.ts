const handleShareTwitter = () => {
    const text = encodeURIComponent("Check this out from flexable!!");
    const twitterShareLink = `https://twitter.com/intent/tweet?text=${text}&url=${window.location.href}`;
    window.open(twitterShareLink, "_blank");
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent("Check this out from flexable!");
    const linkedInShareLink = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
    window.open(linkedInShareLink, "_blank");
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent("Check this out from flexable!");
    const shareLink = `https://www.facebook.com/sharer.php?u=${url}`;
    window.open(shareLink, "_blank");
  };

  

  const handleShareWhatsapp = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent("Check this out from flexable!");
    const shareLink = `whatsapp://shareLink?text=${title}&url=${url}`;
    window.open(shareLink, "_blank");
  }; 


export {handleShareLinkedIn, handleShareTwitter, handleShareWhatsapp, handleShareFacebook}