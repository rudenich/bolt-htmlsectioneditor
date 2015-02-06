<?php

namespace Bolt\Extensions\HtmlSection;

use Bolt\Application;
use Bolt\BaseExtension;

class Extension extends BaseExtension
{
    
    public function __construct(Application $app)
    {
        parent::__construct($app);
        $this->app['config']->fields->addField(new HtmlSectionField());
        if ($this->app['config']->getWhichEnd()=='backend') {
            $this->app['htmlsnippets'] = true;
            $this->app['twig.loader.filesystem']->prependPath(__DIR__."/twig");
        }
    }
  

    public function initialize() {
        $this->addCss('assets/htmlsection.css');
        $this->addJavascript('assets/htmlsection.js', true);
        $this->addJavascript('assets/start.js', true);
    }

    public function getName()
    {
        return "HtmlSection";
    }

}






