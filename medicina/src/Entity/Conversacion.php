<?php
// Conversacion.php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="conversaciones")
 */
class Conversacion
{

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer",name="codConversacion")
     */
    private $codConversacion;

    /**
     * @ORM\Column(type="datetime", name = "fechaInicio"))
     */
    private $fechaInicio;

    /**
     * @ORM\Column(type="datetime", name = "fechaFin"))
     */
    private $fechaFin;

    /**
     * @ORM\Column(type="string", name = "tema"))
     */
    private $tema;

    /**
     * @return mixed
     */
    public function getCodConversacion()
    {
        return $this->codConversacion;
    }

    /**
     * @param mixed $codConversacion
     */
    public function setCodConversacion($codConversacion): void
    {
        $this->codConversacion = $codConversacion;
    }

    /**
     * @return mixed
     */
    public function getFechaInicio()
    {
        return $this->fechaInicio;
    }

    /**
     * @param mixed $fechaInicio
     */
    public function setFechaInicio($fechaInicio): void
    {
        $this->fechaInicio = $fechaInicio;
    }

    /**
     * @return mixed
     */
    public function getFechaFin()
    {
        return $this->fechaFin;
    }

    /**
     * @param mixed $fechaFin
     */
    public function setFechaFin($fechaFin): void
    {
        $this->fechaFin = $fechaFin;
    }

    /**
     * @return mixed
     */
    public function getTema()
    {
        return $this->tema;
    }

    /**
     * @param mixed $tema
     */
    public function setTema($tema): void
    {
        $this->tema = $tema;
    }


}