---
layout: default
title: Stage Stop Gun Shop
description: |-
  Stage Stop Gun Shop & Indoor Range offers firearms, archery supplies, training, online education, indoor ranges, and Atwater and Mariposa locations.
permalink: /
---

<section>
    <div class="container">
        <h2 class="section-title text-center mb-0">LOCATIONS</h2>
        <p class="lead text-center">We have two wonderful locations for your firearm needs.</p>
        <div class="spacer spacer-line border-primary">&nbsp;</div>
        <div class="row">
            {% assign counter = 0 %}
            {% for location in site.data.locations %}
            <div class="col-md-5{% if counter == 0 %} offset-md-1{% endif %}">
                <div class="block image-block text-center">
                    <img src="{{ location.image }}" class=" mb-3" alt="">
                    <h6 class="box-title">{{ location.name }}</h6>
                    <p class="mb-1">{{ location.address }}</p>
                    <ul>
                        {% for feature in location.features %}
                        <li>{{ feature }}</li>
                        {% endfor %}
                    </ul>
                </div><!-- / image-block -->
            </div>
            {% capture counter %}{{counter | plus: 1}}{% endcapture %}
            {% endfor %}
        </div>
    </div>
</section>

<section>
    <div class="container">
        <div class="row">
            <div class="col-md-3">
                <div class="promo-box text-center inner-space">
                    {% include icon.html name="library-books" class="dp36 mb-1 box-icon bg-transparent text-primary" %}
                    <h6 class="box-title"><a href="#x" class="promo-link">TRAINING</a></h6>
                    <p class="box-description">
                    Learn to not only be comfortable with using your firearm but also how to use it properly.
                    </p>
                    <a href="/training" class="btn btn-black">LEARN MORE</a>
                </div><!-- / icon-block -->
            </div><!-- / column -->
            <div class="col-md-3">
                <div class="promo-box text-center inner-space">
                    {% include icon.html name="album" class="dp36 mb-1 box-icon bg-transparent text-primary" %}
                    <h6 class="box-title"><a href="#x" class="promo-link">INDOOR RANGE</a></h6>
                    <p class="box-description">State of the art indoor range. We also rent firearms for use in our range.</p>
                    <a href="/range" class="btn btn-black">LEARN MORE</a>
                </div><!-- / icon-block -->
            </div><!-- / column -->
            <div class="col-md-3">
                <div class="promo-box text-center inner-space">
                    {% include icon.html name="play" class="dp36 mb-1 box-icon bg-transparent text-primary" %}
                    <h6 class="box-title"><a href="#x" class="promo-link">ARCHERY</a></h6>
                    <p class="box-description">Now is the time to checkout archery. See if it's for you.</p>
                    <a href="/range" class="btn btn-black">LEARN MORE</a>
                </div><!-- / icon-block -->
            </div><!-- / column -->
            <div class="col-md-3">
                <div class="promo-box text-center inner-space">
                    {% include icon.html name="lock" class="dp36 mb-1 box-icon bg-transparent text-primary" %}
                    <h6 class="box-title"><a href="#x" class="promo-link">PERSONAL SECURITY</a></h6>
                    <p class="box-description">
                    We are happy to help guide you through your decision-making process.
                    </p>
                    <a href="/about" class="btn btn-black">CONTACT US</a>
                </div><!-- / icon-block -->
            </div><!-- / column -->
        </div>
    </div><!-- / container -->
</section>
