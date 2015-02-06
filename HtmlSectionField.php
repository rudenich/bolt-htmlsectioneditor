<?php

namespace Bolt\Extensions\HtmlSection;

use Bolt\Field\FieldInterface;

class HtmlSectionField implements FieldInterface
{
    
    public function getName()
    {
        return 'HtmlSection';
    }
    
    public function getTemplate()
    {
        return '_htmlsection.twig';
    }
    
    public function getStorageType()
    {
        return 'textarea';
    }
    
    public function getStorageOptions()
    {
        return array('default'=>'');
    }
    
}
