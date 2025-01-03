        .arch armv8-a
        .file   "moda.c"
        .text
        .align  2
        .p2align 4,,11
        .global calculateMode
        .type   calculateMode, %function
calculateMode:
.LFB22:
        .cfi_startproc
        mov     x12, 16000
        sub     sp, sp, x12
        .cfi_def_cfa_offset 16000
        cmp     w1, 0
        ble     .L2
        ldr     d1, [x0]
        mov     x4, x0
        add     x5, x0, w1, sxtw 3
        mov     x3, sp
        add     x6, sp, 8
        mov     w2, 0
        mov     w7, 1
        .p2align 3,,7
.L3:
        sbfiz   x0, x2, 4, 32
        add     x4, x4, 8
        add     w2, w2, 1
        str     w7, [x6, x0]
        str     d1, [x3, x0]
        cmp     x4, x5
        beq     .L6
.L5:
        ldr     d1, [x4]
        mov     x1, x3
        mov     w0, 0
        b       .L7
        .p2align 2,,3
.L4:
        add     w0, w0, 1
        cmp     w2, w0
        beq     .L3
.L7:
        ldr     d0, [x1]
        add     x1, x1, 16
        fcmp    d0, d1
        bne     .L4
        sbfiz   x0, x0, 4, 32
        add     x4, x4, 8
        ldr     w1, [x6, x0]
        add     w1, w1, 1
        str     w1, [x6, x0]
        cmp     x4, x5
        bne     .L5
.L6:
        ldr     d0, [sp]
        ldr     w4, [sp, 8]
        cmp     w2, 1
        beq     .L1
        sub     w0, w2, #2
        add     x2, x3, 32
        add     x1, x3, 16
        add     x0, x2, w0, uxtw 4
        .p2align 3,,7
.L11:
        ldr     w2, [x1, 8]
        cmp     w4, w2
        bge     .L10
        ldr     d0, [x1]
        mov     w4, w2
.L10:
        add     x1, x1, 16
        cmp     x0, x1
        bne     .L11
.L1:
        add     sp, sp, x12
        .cfi_remember_state
        .cfi_def_cfa_offset 0
        ret
.L2:
        .cfi_restore_state
        ldr     d0, [sp]
        add     sp, sp, x12
        .cfi_def_cfa_offset 0
        ret
        .cfi_endproc
.LFE22:
        .size   calculateMode, .-calculateMode
        .section        .rodata.str1.8,"aMS",@progbits,1
        .align  3
.LC0:
        .string "r"
        .align  3
.LC1:
        .string "data.csv"
        .align  3
.LC2:
        .string "Error opening data.csv"
        .align  3
.LC3:
        .string ","
        .align  3
.LC4:
        .string "w"
        .align  3
.LC5:
        .string "moda.txt"
        .align  3
.LC6:
        .string "Error creating moda.txt"
        .align  3
.LC7:
        .string "\nModa de los datos:"
        .align  3
.LC8:
        .string "Moda de los datos:\n"
        .align  3
.LC9:
        .string "Temperatura Externa: %.2f\n"
        .align  3
.LC10:
        .string "Temperatura Interna: %.2f\n"
        .align  3
.LC11:
        .string "Humedad Relativa: %.2f\n"
        .align  3
.LC12:
        .string "Nivel de Agua: %.2f\n"
        .align  3
.LC13:
        .string "\nResultados exportados a moda.txt"
        .section        .text.startup,"ax",@progbits
        .align  2
        .p2align 4,,11
        .global main
        .type   main, %function
main:
.LFB23:
        .cfi_startproc
        mov     x12, 32384
        sub     sp, sp, x12
        .cfi_def_cfa_offset 32384
        adrp    x1, .LC0
        adrp    x0, .LC1
        add     x1, x1, :lo12:.LC0
        add     x0, x0, :lo12:.LC1
        stp     x29, x30, [sp]
        .cfi_offset 29, -32384
        .cfi_offset 30, -32376
        mov     x29, sp
        bl      fopen
        cbz     x0, .L39
        stp     x25, x26, [sp, 64]
        .cfi_offset 26, -32312
        .cfi_offset 25, -32320
        mov     x26, x0
        add     x25, sp, 128
        mov     x2, x26
        mov     w1, 256
        mov     x0, x25
        stp     x19, x20, [sp, 16]
        .cfi_offset 20, -32360
        .cfi_offset 19, -32368
        stp     x21, x22, [sp, 32]
        .cfi_offset 22, -32344
        .cfi_offset 21, -32352
        adrp    x21, .LC3
        mov     x22, 8000
        stp     x23, x24, [sp, 48]
        .cfi_offset 24, -32328
        .cfi_offset 23, -32336
        add     x21, x21, :lo12:.LC3
        mov     w23, 0
        str     x27, [sp, 80]
        .cfi_offset 27, -32304
        add     x27, sp, 384
        str     d8, [sp, 88]
        .cfi_offset 72, -32296
        bl      fgets
        mov     x24, x27
        mov     x2, x26
        mov     x0, x25
        mov     w1, 256
        bl      fgets
        cbz     x0, .L25
        .p2align 3,,7
.L40:
        cmp     w23, 1000
        beq     .L25
        mov     x20, x24
        mov     x1, x21
        mov     x0, x25
        mov     w19, 4
        bl      strtok
.L24:
        mov     x1, x21
        mov     x0, 0
        bl      strtok
        mov     x1, 0
        cbz     x0, .L23
        bl      strtod
        str     d0, [x20]
.L23:
        add     x20, x20, x22
        subs    w19, w19, #1
        bne     .L24
        add     w23, w23, 1
        add     x24, x24, 8
        mov     x2, x26
        mov     x0, x25
        mov     w1, 256
        bl      fgets
        cbnz    x0, .L40
.L25:
        add     x21, sp, 96
        mov     x0, x26
        mov     x19, 1
        mov     x20, 8000
        bl      fclose
.L27:
        mov     x0, x27
        mov     w1, w23
        bl      calculateMode
        add     x27, x27, x20
        add     x0, x21, x19, lsl 3
        add     x19, x19, 1
        str     d0, [x0, -8]
        cmp     x19, 5
        bne     .L27
        adrp    x1, .LC4
        adrp    x0, .LC5
        add     x1, x1, :lo12:.LC4
        add     x0, x0, :lo12:.LC5
        bl      fopen
        mov     x19, x0
        cbz     x0, .L41
        adrp    x0, .LC7
        add     x0, x0, :lo12:.LC7
        bl      puts
        adrp    x21, .LC9
        mov     x3, x19
        mov     x2, 19
        mov     x1, 1
        adrp    x0, .LC8
        add     x0, x0, :lo12:.LC8
        bl      fwrite
        ldr     d8, [sp, 96]
        add     x21, x21, :lo12:.LC9
        mov     x0, x21
        adrp    x20, .LC12
        add     x20, x20, :lo12:.LC12
        fmov    d0, d8
        bl      printf
        fmov    d0, d8
        mov     x1, x21
        mov     x0, x19
        adrp    x21, .LC10
        add     x21, x21, :lo12:.LC10
        bl      fprintf
        ldr     d8, [sp, 104]
        mov     x0, x21
        fmov    d0, d8
        bl      printf
        fmov    d0, d8
        mov     x1, x21
        mov     x0, x19
        adrp    x21, .LC11
        add     x21, x21, :lo12:.LC11
        bl      fprintf
        ldr     d8, [sp, 112]
        mov     x0, x21
        fmov    d0, d8
        bl      printf
        fmov    d0, d8
        mov     x1, x21
        mov     x0, x19
        bl      fprintf
        ldr     d8, [sp, 120]
        mov     x0, x20
        fmov    d0, d8
        bl      printf
        fmov    d0, d8
        mov     x1, x20
        mov     x0, x19
        bl      fprintf
        mov     x0, x19
        bl      fclose
        bl      exit
        adrp    x0, .LC13
        add     x0, x0, :lo12:.LC13
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
        ldr     x27, [sp, 80]
        .cfi_restore 27
        ldr     d8, [sp, 88]
        .cfi_restore 72
.L19:
        ldp     x29, x30, [sp]
        mov     x12, 32384
        add     sp, sp, x12
        .cfi_remember_state
        .cfi_restore 29
        .cfi_restore 30
        .cfi_def_cfa_offset 0
        ret
.L39:
        .cfi_restore_state
        adrp    x0, .LC2
        add     x0, x0, :lo12:.LC2
        bl      puts
        mov     w0, 1
        b       .L19
.L41:
        .cfi_offset 19, -32368
        .cfi_offset 20, -32360
        .cfi_offset 21, -32352
        .cfi_offset 22, -32344
        .cfi_offset 23, -32336
        .cfi_offset 24, -32328
        .cfi_offset 25, -32320
        .cfi_offset 26, -32312
        .cfi_offset 27, -32304
        .cfi_offset 72, -32296
        adrp    x0, .LC6
        add     x0, x0, :lo12:.LC6
        bl      puts
        ldp     x19, x20, [sp, 16]
        .cfi_restore 20
        .cfi_restore 19
        mov     w0, 1
        ldp     x21, x22, [sp, 32]
        .cfi_restore 22
        .cfi_restore 21
        ldp     x23, x24, [sp, 48]
        .cfi_restore 24
        .cfi_restore 23
        ldp     x25, x26, [sp, 64]
        .cfi_restore 26
        .cfi_restore 25
        ldr     x27, [sp, 80]
        .cfi_restore 27
        ldr     d8, [sp, 88]
        .cfi_restore 72
        b       .L19
        .cfi_endproc
.LFE23:
        .size   main, .-main
        .ident  "GCC: (Debian 12.2.0-14) 12.2.0"
        .section        .note.GNU-stack,"",@progbits