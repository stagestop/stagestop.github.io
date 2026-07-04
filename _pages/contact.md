---
layout: default
title: Contact Us
permalink: /contact
---
<section id="contact">
    <div class="container">
        <div class="row vcenter">
            <div class="col-md-5">
                <h5 class="mt-3">GET IN TOUCH</h5>
                <div class="spacer spacer-line border-primary ml-0">&nbsp;</div>
                <p class="lead">
                    Complete the below form or visit us at one of our locations to get in touch!
                </p>
                <form action="//formspree.io/info@ssgs.us" method="POST" id="contactForm">
                    <div class="row">
                        <div class="col-md-6 sub-col-left">
                            <div class="form-group">
                                <input type="text" class="form-control" id="name" name="name" placeholder="*Name" required>
                                <div class="help-block with-errors"></div>
                            </div>
                        </div><!-- / sub-column -->
                        <div class="col-md-6 sub-col-right">
                            <div class="form-group">
                                <input type="email" class="form-control" id="email" name="_replyto" placeholder="*Email" required>
                                <div class="help-block with-errors"></div>
                            </div>
                        </div><!-- / sub-column -->
                        <div class="col-md-12">
                            <div class="form-group">
                                <input type="text" class="form-control" id="subject" name="_subject" placeholder="Subject">
                                <div class="help-block with-errors"></div>
                            </div>
                        </div><!-- / sub-column -->
                        <div class="col-md-12">
                            <div class="form-group">
                                <textarea id="message" name="message" class="form-control" rows="5" placeholder="*Message" required></textarea>
                                <div class="help-block with-errors"></div>
                            </div>
                        </div><!-- / sub-column -->
                    </div><!-- / row -->
                    <button type="submit" id="form-submit" class="btn btn-primary"><i class="md-icon dp14 me-1">send</i> <span>SEND MESSAGE</span></button>
                    <div id="msgSubmit" class="h3 text-center hidden"></div>
                    <div class="clearfix"></div> 
                </form><!-- / contactform -->
            </div><!-- / column -->
            <div class="col-md-7">
                <div id="map">
                </div><!-- / map -->
            </div><!-- / column -->
        </div><!-- / row -->
    </div><!-- / container -->
</section> <!-- / contact -->
