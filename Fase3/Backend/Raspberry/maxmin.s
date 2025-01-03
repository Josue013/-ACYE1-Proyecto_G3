        .arch armv8-a
        .file   "maxmin.c"
        .text
        .section        .rodata.str1.8,"aMS",@progbits,1
        .align  3
.LC0:
        .string "%s -> Datos insuficientes.\n"
        .align  3
.LC1:
        .string "%s -> M\303\241ximo: %.2f, M\303\255nimo: %.2f\n"
        .text
        .align  2
        .p2align 4,,11
        .global findMaxMin
        .type   findMaxMin, %function
findMaxMin:
.LFB23:
        .cfi_startproc
        mov     w6, w1
        mov     x1, x4
        cmp     w6, 0
        ble     .L16
        ldr     s1, [x0]
        str     s1, [x2]
        str     s1, [x3]
        cmp     w6, 1
        beq     .L3
        mov     x5, 1
        .p2align 3,,7
.L8:
        ldr     s0, [x0, x5, lsl 2]
        ldr     s1, [x2]
        fcmpe   s0, s1
        bgt     .L9
.L4:
        ldr     s1, [x3]
        fcmpe   s0, s1
        bmi     .L10
.L6:
        add     x5, x5, 1
        cmp     w6, w5
        bgt     .L8
        ldr     s1, [x3]
.L3:
        ldr     s0, [x2]
        fcvt    d1, s1
        adrp    x0, .LC1
        add     x0, x0, :lo12:.LC1
        fcvt    d0, s0
        b       printf
        .p2align 2,,3
.L9:
        str     s0, [x2]
        b       .L4
        .p2align 2,,3
.L10:
        str     s0, [x3]
        b       .L6
        .p2align 2,,3
.L16:
        adrp    x0, .LC0
        add     x0, x0, :lo12:.LC0
        b       printf
        .cfi_endproc
.LFE23:
        .size   findMaxMin, .-findMaxMin
        .section        .rodata.str1.8
        .align  3
.LC2:
        .string "No hay datos para exportar."
        .align  3
.LC3:
        .string "w"
        .align  3
.LC4:
        .string "No se pudo abrir el archivo para escribir"
        .align  3
.LC5:
        .string "%.2f,%.2f\n"
        .text
        .align  2
        .p2align 4,,11
        .global exportMaxMinData
        .type   exportMaxMinData, %function
exportMaxMinData:
.LFB24:
        .cfi_startproc
        cmp     w4, 0
        ble     .L18
        stp     x29, x30, [sp, -96]!
        .cfi_def_cfa_offset 96
        .cfi_offset 29, -96
        .cfi_offset 30, -88
        mov     x7, x0
        mov     x0, x5
        mov     x29, sp
        stp     d8, d9, [sp, 32]
        .cfi_offset 72, -64
        .cfi_offset 73, -56
        ldr     s9, [x2]
        ldr     s8, [x3]
        stp     d10, d11, [sp, 48]
        .cfi_offset 74, -48
        .cfi_offset 75, -40
        ldr     s10, [x1]
        ldr     s11, [x7]
        stp     x19, x20, [sp, 16]
        stp     d12, d13, [sp, 64]
        .cfi_offset 19, -80
        .cfi_offset 20, -72
        .cfi_offset 76, -32
        .cfi_offset 77, -24
        fmov    s13, s9
        fmov    s12, s8
        stp     d14, d15, [sp, 80]
        .cfi_offset 78, -16
        .cfi_offset 79, -8
        fmov    s14, s10
        fmov    s15, s11
        cmp     w4, 1
        beq     .L19
        mov     x6, 1
        .p2align 3,,7
.L36:
        ldr     s2, [x7, x6, lsl 2]
        fcmpe   s11, s2
        bmi     .L39
.L20:
        fcmpe   s15, s2
        bgt     .L40
.L22:
        ldr     s2, [x1, x6, lsl 2]
        fcmpe   s10, s2
        bmi     .L41
.L24:
        fcmpe   s14, s2
        bgt     .L42
.L26:
        ldr     s2, [x2, x6, lsl 2]
        fcmpe   s9, s2
        bmi     .L43
.L28:
        fcmpe   s13, s2
        bgt     .L44
.L30:
        ldr     s2, [x3, x6, lsl 2]
        fcmpe   s8, s2
        bmi     .L45
.L32:
        fcmpe   s12, s2
        bgt     .L46
.L34:
        add     x6, x6, 1
        cmp     w4, w6
        bgt     .L36
.L19:
        adrp    x1, .LC3
        add     x1, x1, :lo12:.LC3
        bl      fopen
        mov     x19, x0
        cbz     x0, .L51
        fcvt    d1, s15
        fcvt    d0, s11
        adrp    x20, .LC5
        add     x20, x20, :lo12:.LC5
        mov     x1, x20
        bl      fprintf
        fcvt    d1, s14
        fcvt    d0, s10
        mov     x1, x20
        mov     x0, x19
        bl      fprintf
        fcvt    d1, s13
        fcvt    d0, s9
        mov     x1, x20
        mov     x0, x19
        bl      fprintf
        fcvt    d1, s12
        fcvt    d0, s8
        mov     x1, x20
        mov     x0, x19
        bl      fprintf
        ldp     d8, d9, [sp, 32]
        mov     x0, x19
        ldp     x19, x20, [sp, 16]
        ldp     d10, d11, [sp, 48]
        ldp     d12, d13, [sp, 64]
        ldp     d14, d15, [sp, 80]
        ldp     x29, x30, [sp], 96
        .cfi_remember_state
        .cfi_restore 30
        .cfi_restore 29
        .cfi_restore 19
        .cfi_restore 20
        .cfi_restore 78
        .cfi_restore 79
        .cfi_restore 76
        .cfi_restore 77
        .cfi_restore 74
        .cfi_restore 75
        .cfi_restore 72
        .cfi_restore 73
        .cfi_def_cfa_offset 0
        b       fclose
        .p2align 2,,3
.L46:
        .cfi_restore_state
        fmov    s12, s2
        b       .L34
        .p2align 2,,3
.L45:
        fmov    s8, s2
        b       .L32
        .p2align 2,,3
.L44:
        fmov    s13, s2
        b       .L30
        .p2align 2,,3
.L43:
        fmov    s9, s2
        b       .L28
        .p2align 2,,3
.L42:
        fmov    s14, s2
        b       .L26
        .p2align 2,,3
.L41:
        fmov    s10, s2
        b       .L24
        .p2align 2,,3
.L40:
        fmov    s15, s2
        b       .L22
        .p2align 2,,3
.L39:
        fmov    s11, s2
        b       .L20
        .p2align 2,,3
.L18:
        .cfi_def_cfa_offset 0
        .cfi_restore 19
        .cfi_restore 20
        .cfi_restore 29
        .cfi_restore 30
        .cfi_restore 72
        .cfi_restore 73
        .cfi_restore 74
        .cfi_restore 75
        .cfi_restore 76
        .cfi_restore 77
        .cfi_restore 78
        .cfi_restore 79
        adrp    x0, .LC2
        add     x0, x0, :lo12:.LC2
        b       puts
.L51:
        .cfi_def_cfa_offset 96
        .cfi_offset 19, -80
        .cfi_offset 20, -72
        .cfi_offset 29, -96
        .cfi_offset 30, -88
        .cfi_offset 72, -64
        .cfi_offset 73, -56
        .cfi_offset 74, -48
        .cfi_offset 75, -40
        .cfi_offset 76, -32
        .cfi_offset 77, -24
        .cfi_offset 78, -16
        .cfi_offset 79, -8
        ldp     x19, x20, [sp, 16]
        adrp    x0, .LC4
        ldp     d8, d9, [sp, 32]
        add     x0, x0, :lo12:.LC4
        ldp     d10, d11, [sp, 48]
        ldp     d12, d13, [sp, 64]
        ldp     d14, d15, [sp, 80]
        ldp     x29, x30, [sp], 96
        .cfi_restore 30
        .cfi_restore 29
        .cfi_restore 19
        .cfi_restore 20
        .cfi_restore 78
        .cfi_restore 79
        .cfi_restore 76
        .cfi_restore 77
        .cfi_restore 74
        .cfi_restore 75
        .cfi_restore 72
        .cfi_restore 73
        .cfi_def_cfa_offset 0
        b       perror
        .cfi_endproc
.LFE24:
        .size   exportMaxMinData, .-exportMaxMinData
        .section        .rodata.str1.8
        .align  3
.LC6:
        .string "r"
        .align  3
.LC7:
        .string "data.csv"
        .align  3
.LC8:
        .string "No se pudo abrir el archivo"
        .align  3
.LC9:
        .string "El archivo est\303\241 vac\303\255o o no tiene encabezado.\n"
        .align  3
.LC10:
        .string "%19[^,],%f,%f,%f,%f"
        .align  3
.LC11:
        .string "Error al procesar la l\303\255nea: %s\n"
        .align  3
.LC12:
        .string "M\303\241ximo y m\303\255nimo de cada arreglo:"
        .align  3
.LC13:
        .string "Temperatura Externa"
        .align  3
.LC14:
        .string "Temperatura Interna"
        .align  3
.LC15:
        .string "Humedad Relativa"
        .align  3
.LC16:
        .string "Nivel de Agua"
        .align  3
.LC17:
        .string "maxmin.txt"
        .align  3
.LC18:
        .string "Datos exportados a maxmin.txt"
        .section        .text.startup,"ax",@progbits
        .align  2
        .p2align 4,,11
        .global main
        .type   main, %function
main:
.LFB22:
        .cfi_startproc
        sub     sp, sp, #1744
        .cfi_def_cfa_offset 1744
        adrp    x1, .LC6
        adrp    x0, .LC7
        add     x1, x1, :lo12:.LC6
        add     x0, x0, :lo12:.LC7
        stp     x29, x30, [sp]
        .cfi_offset 29, -1744
        .cfi_offset 30, -1736
        mov     x29, sp
        bl      fopen
        cbz     x0, .L66
        stp     x19, x20, [sp, 16]
        .cfi_offset 20, -1720
        .cfi_offset 19, -1728
        add     x19, sp, 720
        mov     x2, x0
        mov     w1, 1024
        stp     x21, x22, [sp, 32]
        .cfi_offset 22, -1704
        .cfi_offset 21, -1712
        mov     x22, x0
        mov     x0, x19
        bl      fgets
        cbz     x0, .L67
        stp     x25, x26, [sp, 64]
        .cfi_offset 26, -1672
        .cfi_offset 25, -1680
        adrp    x0, .LC11
        add     x21, sp, 136
        adrp    x25, :got:stderr
        ldr     x25, [x25, :got_lo12:stderr]
        add     x0, x0, :lo12:.LC11
        add     x26, sp, 160
        stp     x23, x24, [sp, 48]
        .cfi_offset 24, -1688
        .cfi_offset 23, -1696
        adrp    x24, .LC10
        add     x23, sp, 132
        add     x24, x24, :lo12:.LC10
        stp     x27, x28, [sp, 80]
        .cfi_offset 28, -1656
        .cfi_offset 27, -1664
        add     x27, sp, 288
        add     x28, sp, 352
        mov     w20, 0
        str     x0, [sp, 96]
        add     x0, sp, 224
        str     x0, [sp, 104]
        .p2align 3,,7
.L55:
        mov     x2, x22
        mov     w1, 1024
        mov     x0, x19
        bl      fgets
        mov     x6, x23
        mov     x7, x0
        add     x5, sp, 128
        add     x4, sp, 124
        add     x3, sp, 120
        mov     x2, x21
        mov     x1, x24
        mov     x0, x19
        cbz     x7, .L59
        cmp     w20, 15
        beq     .L59
        bl      __isoc99_sscanf
        cmp     w0, 5
        beq     .L68
        ldr     x0, [x25]
        mov     x2, x19
        ldr     x1, [sp, 96]
        bl      fprintf
        b       .L55
        .p2align 2,,3
.L68:
        add     x0, sp, 416
        mov     w2, 20
        mov     x1, x21
        smaddl  x0, w20, w2, x0
        bl      strcpy
        ldr     x1, [sp, 104]
        sxtw    x0, w20
        ldp     s3, s2, [sp, 120]
        add     w20, w20, 1
        ldp     s1, s0, [sp, 128]
        str     s3, [x26, x0, lsl 2]
        str     s2, [x1, x0, lsl 2]
        str     s1, [x27, x0, lsl 2]
        str     s0, [x28, x0, lsl 2]
        b       .L55
        .p2align 2,,3
.L59:
        mov     x0, x22
        bl      fclose
        adrp    x0, .LC12
        add     x0, x0, :lo12:.LC12
        bl      puts
        mov     x3, x21
        mov     x2, x23
        mov     w1, w20
        mov     x0, x26
        adrp    x4, .LC13
        add     x4, x4, :lo12:.LC13
        bl      findMaxMin
        ldr     x19, [sp, 104]
        mov     x3, x21
        mov     x2, x23
        mov     w1, w20
        mov     x0, x19
        adrp    x4, .LC14
        add     x4, x4, :lo12:.LC14
        bl      findMaxMin
        mov     x3, x21
        mov     x2, x23
        mov     w1, w20
        mov     x0, x27
        adrp    x4, .LC15
        add     x4, x4, :lo12:.LC15
        bl      findMaxMin
        mov     x3, x21
        mov     x2, x23
        mov     w1, w20
        mov     x0, x28
        adrp    x4, .LC16
        add     x4, x4, :lo12:.LC16
        bl      findMaxMin
        mov     w4, w20
        mov     x3, x28
        mov     x2, x27
        mov     x1, x19
        adrp    x5, .LC17
        add     x5, x5, :lo12:.LC17
        mov     x0, x26
        bl      exportMaxMinData
        adrp    x0, .LC18
        add     x0, x0, :lo12:.LC18
        bl      puts
        ldp     x19, x20, [sp, 16]
        .cfi_restore 20
        .cfi_restore 19
        mov     w0, 0
        ldp     x21, x22, [sp, 32]
        .cfi_restore 22
        .cfi_restore 21
        ldp     x23, x24, [sp, 48]
        .cfi_restore 24
        .cfi_restore 23
        ldp     x25, x26, [sp, 64]
        .cfi_restore 26
        .cfi_restore 25
        ldp     x27, x28, [sp, 80]
        .cfi_restore 28
        .cfi_restore 27
        bl      exit
.L52:
        ldp     x29, x30, [sp]
        add     sp, sp, 1744
        .cfi_restore 29
        .cfi_restore 30
        .cfi_def_cfa_offset 0
        ret
.L67:
        .cfi_def_cfa_offset 1744
        .cfi_offset 19, -1728
        .cfi_offset 20, -1720
        .cfi_offset 21, -1712
        .cfi_offset 22, -1704
        .cfi_offset 29, -1744
        .cfi_offset 30, -1736
        adrp    x3, :got:stderr
        ldr     x3, [x3, :got_lo12:stderr]
        mov     x2, 47
        mov     x1, 1
        adrp    x0, .LC9
        add     x0, x0, :lo12:.LC9
        ldr     x3, [x3]
        bl      fwrite
        mov     x0, x22
        bl      fclose
        ldp     x19, x20, [sp, 16]
        .cfi_restore 20
        .cfi_restore 19
        mov     w0, 1
        ldp     x21, x22, [sp, 32]
        .cfi_restore 22
        .cfi_restore 21
        b       .L52
.L66:
        adrp    x0, .LC8
        add     x0, x0, :lo12:.LC8
        bl      perror
        mov     w0, 1
        b       .L52
        .cfi_endproc

.LFE22:
        .size   main, .-main
        .ident  "GCC: (Debian 12.2.0-14) 12.2.0"
        .section        .note.GNU-stack,"",@progbits