<?php
// Participante.php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="participantes")
 */
class Participante
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer",name="codParticipante")
     */
    private $codParticipante;

    /**
     * @ORM\ManyToOne(targetEntity="Conversacion")
     * @ORM\JoinColumn(name="codConversacion", referencedColumnName="codConversacion")
     */
    private $codConversacion;

    /**
     * @return mixed
     */
    public function getCodParticipante()
    {
        return $this->codParticipante;
    }

    /**
     * @param mixed $codParticipante
     */
    public function setCodParticipante($codParticipante): void
    {
        $this->codParticipante = $codParticipante;
    }

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
    public function getCodUsuario()
    {
        return $this->codUsuario;
    }

    /**
     * @param mixed $codUsuario
     */
    public function setCodUsuario($codUsuario): void
    {
        $this->codUsuario = $codUsuario;
    }

    /**
     * @ORM\ManyToOne(targetEntity="Usuario")
     * @ORM\JoinColumn(name="codUsuario", referencedColumnName="codUsuario")
     */
    private $codUsuario;

    /**
     * @return mixed
     */


}
