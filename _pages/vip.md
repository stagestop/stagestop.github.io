---
title: VIP Event Space
titlewhite: Event Space
titleaccent: VIP
description: Contact us to book your next event in our VIP accommodations
permalink: /vip
layout: default-container
---

# VIP Rentals

Whether you are planning a party or a meeting, Stage Stop Gun Shop & Indoor Range is the perfect event venue.  We have a beautifully decorated VIP Lounge, a large banquet room that can accommodate approx 100 guests and a VIP Bay that is attached to the lounge.  All three areas can be rented indivually or can be combined based on your needs.  


{% include section.html id="VIP_LOUNGE" %}
{% include section.html id="VIP_BAY" %}
{% include section.html id="CLASSROOM" %}


# To book your next event - call or text: {% include phone-number.html number="(209) 864-5249" %}<br />

<section>
    <div class="container">
        <div class="row vcenter">
            <div class="col-md-6 col-offset-3">
                <h5 class="mt-3">SUBMIT YOUR INQUIRY</h5>
                <div class="spacer spacer-line border-primary ml-0">&nbsp;</div>
                <p class="lead">
                    Complete the below form to inquire about reserving the space for your next event!
                </p>
                <form action="https://formspree.io/f/mbjwqnyp" method="POST" id="contactForm" data-toggle="validator">
                    <div class="row">
                        <div class="col-md-6 sub-col-left">
                            <div class="form-group">
                                <input type="text" class="form-control" name="name" placeholder="*Name" required>
                                <div class="help-block with-errors"></div>
                            </div>
                        </div><!-- / sub-column -->
                        <div class="col-md-6 sub-col-right">
                            <div class="form-group">
                                <input type="email" class="form-control" name="_replyto" placeholder="*Email">
                                <div class="help-block with-errors"></div>
                            </div>
                        </div><!-- / sub-column -->
                        <div class="col-md-12">
                            <div class="form-group">
                                <input type="text" class="form-control" name="_subject" placeholder="Subject">
                                <div class="help-block with-errors"></div>
                            </div>
                        </div><!-- / sub-column -->
                        <div class="col-md-12">
                            <div class="form-group">
                                <textarea name="message" class="form-control" rows="5" placeholder="*Message" required></textarea>
                                <div class="help-block with-errors"></div>
                            </div>
                        </div><!-- / sub-column -->
                    </div><!-- / row -->
                    <button type="submit" id="form-submit" class="btn btn-primary"><i class="md-icon dp14 mr-1">send</i> <span>SEND MESSAGE</span></button>
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
