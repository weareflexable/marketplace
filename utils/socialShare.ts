const handleShareTwitter = () => {
    const text = encodeURIComponent("Check out this community event from flexable!!");
    const twitterShareLink = `https://twitter.com/intent/tweet?text=${text}&url=${window.location.href}`;
    window.open(twitterShareLink, "_blank");
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent("Check out this community event from flexable!");
    const linkedInShareLink = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
    window.open(linkedInShareLink, "_blank");
  };

export {handleShareLinkedIn, handleShareTwitter}