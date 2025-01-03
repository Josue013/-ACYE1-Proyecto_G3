        .arch armv8-a
        .file   "average.c"
        .text
        .section        .rodata.str1.8,"aMS",@progbits,1
        .align  3
.LC0:
        .string "r"
        .align  3
.LC1:
        .string "data.csv"
        .align  3
.LC2:
        .string "Error opening input file"
        .align  3
.LC3:
        .string "w"
        .align  3
.LC4:
        .string "average.txt"
        .align  3
.LC5:
        .string "Error opening output file"
        .align  3
.LC6:
        .string ","
        .align  3
.LC7:
        .string "Promedios:"
        .align  3
.LC8:
        .string "Promedios:\n"
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
        .section        .text.startup,"ax",@progbits
        .align  2
        .p2align 4,,11
        .global main
        .type   main, %function
main:
.LFB22:
        .cfi_startproc
        stp     x29, x30, [sp, -384]!
        .cfi_def_cfa_offset 384
        .cfi_offset 29, -384
        .cfi_offset 30, -376
        adrp    x1, .LC0
        adrp    x0, .LC1
        mov     x29, sp
        add     x1, x1, :lo12:.LC0
        add     x0, x0, :lo12:.LC1
        bl      fopen
        cbz     x0, .L16
        adrp    x1, .LC3
        add     x1, x1, :lo12:.LC3
        stp     x23, x24, [sp, 48]
        .cfi_offset 24, -328
        .cfi_offset 23, -336
        mov     x24, x0
        adrp    x0, .LC4
        add     x0, x0, :lo12:.LC4
        stp     x25, x26, [sp, 64]
        .cfi_offset 26, -312
        .cfi_offset 25, -320
        bl      fopen
        mov     x26, x0
        cbz     x0, .L17
        adrp    x0, .LC13
        add     x0, x0, :lo12:.LC13
        add     x25, sp, 96
        stp     x19, x20, [sp, 16]
        .cfi_offset 20, -360
        .cfi_offset 19, -368
        mov     x2, x24
        ld1     {v0.16b - v1.16b}, [x0]
        stp     x21, x22, [sp, 32]
        .cfi_offset 22, -344
        .cfi_offset 21, -352
        add     x22, sp, 128
        stp     d8, d9, [sp, 80]
        .cfi_offset 73, -296
        .cfi_offset 72, -304
        mov     w1, 256
        mov     x0, x22
        st1     {v0.16b - v1.16b}, [x25]
        bl      fgets
        adrp    x21, .LC6
        mov     x2, x24
        add     x21, x21, :lo12:.LC6
        mov     x0, x22
        mov     w23, 0
        mov     w1, 256
        bl      fgets
        cbz     x0, .L18
        .p2align 3,,7
.L9:
        mov     x19, x25
        mov     x1, x21
        mov     x0, x22
        mov     w20, 4
        bl      strtok
.L8:
        mov     x1, x21
        mov     x0, 0
        bl      strtok
        mov     x1, 0
        cbz     x0, .L7
        ldr     d8, [x19]
        bl      strtod
        fadd    d8, d8, d0
        str     d8, [x19]
.L7:
        add     x19, x19, 8
        subs    w20, w20, #1
        bne     .L8
        add     w23, w23, 1
        mov     x2, x24
        mov     x0, x22
        mov     w1, 256
        bl      fgets
        cbnz    x0, .L9
.L18:
        adrp    x0, .LC7
        add     x0, x0, :lo12:.LC7
        bl      puts
        adrp    x19, .LC9
        mov     x3, x26
        mov     x2, 11
        mov     x1, 1
        adrp    x0, .LC8
        add     x0, x0, :lo12:.LC8
        bl      fwrite
        scvtf   d9, w23
        ldr     d8, [sp, 96]
        add     x19, x19, :lo12:.LC9
        mov     x0, x19
        fdiv    d8, d8, d9
        fmov    d0, d8
        bl      printf
        fmov    d0, d8
        mov     x1, x19
        mov     x0, x26
        adrp    x19, .LC10
        add     x19, x19, :lo12:.LC10
        bl      fprintf
        ldr     d8, [x25, 8]
        mov     x0, x19
        fdiv    d8, d8, d9
        fmov    d0, d8
        bl      printf
        fmov    d0, d8
        mov     x1, x19
        mov     x0, x26
        adrp    x19, .LC11
        add     x19, x19, :lo12:.LC11
        bl      fprintf
        ldr     d8, [x25, 16]
        mov     x0, x19
        fdiv    d8, d8, d9
        fmov    d0, d8
        bl      printf
        fmov    d0, d8
        mov     x1, x19
        mov     x0, x26
        adrp    x19, .LC12
        add     x19, x19, :lo12:.LC12
        bl      fprintf
        ldr     d8, [x25, 24]
        mov     x0, x19
        fdiv    d8, d8, d9
        fmov    d0, d8
        bl      printf
        fmov    d0, d8
        mov     x1, x19
        mov     x0, x26
        bl      fprintf
        mov     x0, x24
        bl      fclose
        mov     x0, x26
        bl      fclose
        ldp     x19, x20, [sp, 16]
        .cfi_restore 20
        .cfi_restore 19
        mov     w0, 0
        bl      exit
        ldp     x21, x22, [sp, 32]
        .cfi_restore 22
        .cfi_restore 21
        ldp     x23, x24, [sp, 48]
        .cfi_restore 24
        .cfi_restore 23
        ldp     x25, x26, [sp, 64]
        .cfi_restore 26
        .cfi_restore 25
        ldp     d8, d9, [sp, 80]
        .cfi_restore 73
        .cfi_restore 72
.L1:
        ldp     x29, x30, [sp], 384
        .cfi_remember_state
        .cfi_restore 30
        .cfi_restore 29
        .cfi_def_cfa_offset 0
        ret
.L16:
        .cfi_restore_state
        adrp    x0, .LC2
        add     x0, x0, :lo12:.LC2
        bl      puts
        mov     w0, 1
        b       .L1
.L17:
        .cfi_offset 23, -336
        .cfi_offset 24, -328
        .cfi_offset 25, -320
        .cfi_offset 26, -312
        adrp    x0, .LC5
        add     x0, x0, :lo12:.LC5
        bl      puts
        mov     x0, x24
        bl      fclose
        ldp     x23, x24, [sp, 48]
        .cfi_restore 24
        .cfi_restore 23
        mov     w0, 1
        ldp     x25, x26, [sp, 64]
        .cfi_restore 26
        .cfi_restore 25
        b       .L1
        .cfi_endproc
.LFE22:
        .size   main, .-main
        .section        .rodata
        .align  4
.LC13:
        .xword  0
        .xword  0
        .xword  0
        .xword  0
        .ident  "GCC: (Debian 12.2.0-14) 12.2.0"
        .section        .note.GNU-stack,"",@progbits